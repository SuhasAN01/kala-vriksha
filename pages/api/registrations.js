import dbConnect from '../../lib/mongodb';
import Registration from '../../models/Registration';
import { getSession } from '../../lib/session';

export default async function handler(req, res) {
  await dbConnect();
  const session = getSession(req);

  if (req.method === 'GET') {
    if (!session) return res.status(403).json({ error: 'Forbidden' });

    const serialize = docs => docs.map(d => {
      const rawType = d?.eventId?.type || d?.eventId?.eventType || '';
      const eventType = String(rawType || '').toLowerCase().trim();

      // DEV-only debug to confirm populated field names
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('populated event fields:', JSON.stringify(d?.eventId));
      }

      const eventId = d.eventId?._id ? {
        _id: d.eventId._id.toString(),
        title: d.eventId.title,
        date: d.eventId.date,
        price: d.eventId.price,
        type: eventType || d.eventId.type,
        classLink: d.eventId.classLink || '',
        whatsappLink: d.eventId.whatsappLink || '',
      } : d.eventId;

      return {
        ...d,
        _id: d._id?.toString(),
        userId: d.userId?._id ? {
          _id: d.userId._id.toString(),
          name: d.userId.name,
          email: d.userId.email,
          phone: d.userId.phone,
        } : d.userId,
        eventId,
        // Flattened join fields for frontend safety
        eventType,
        classLink: d?.eventId?.classLink || '',
        whatsappLink: d?.eventId?.whatsappLink || '',
      };
    });

    if (session.role === 'admin') {
      const all = await Registration.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'name email phone')
        .populate('eventId', 'title date price type classLink whatsappLink')
        .lean();
      return res.status(200).json(serialize(all));
    }

    const mine = await Registration.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .populate('eventId', 'title date price type classLink whatsappLink')
      .lean();
    return res.status(200).json(serialize(mine));
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { action, eventId, transactionId, eventName, userName, userEmail, userPhone, eventDate, reg_id, paymentScreenshot } = req.body || {};

  // Admin Verification
  if (action === 'verify_payment') {
    if (session.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const reg = await Registration.findByIdAndUpdate(reg_id, { paymentStatus: 'verified' }, { new: true })
      .populate('userId', 'name email phone')
      .populate('eventId', 'title date price type classLink whatsappLink')
      .lean();

    if (!reg) return res.status(404).json({ error: 'Registration not found.' });

    // Serialize for JSON
    const serialized = {
      ...reg,
      _id: reg._id.toString(),
      userId: reg.userId?._id ? { _id: reg.userId._id.toString(), name: reg.userId.name, email: reg.userId.email, phone: reg.userId.phone } : null,
      eventId: reg.eventId?._id ? { _id: reg.eventId._id.toString(), title: reg.eventId.title, date: reg.eventId.date, price: reg.eventId.price, type: reg.eventId.type, classLink: reg.eventId.classLink || '', whatsappLink: reg.eventId.whatsappLink || '' } : null,
    };

    return res.status(200).json({ success: true, reg: serialized });
  }

  // User Registration
  if (action === 'register') {
    if (!transactionId || !eventId) {
      return res.status(400).json({ error: 'Transaction ID and Event ID are required.' });
    }

    const newReg = await Registration.create({
      userId: session.id,
      eventId: eventId, // Should be Mongoose ObjectId compatible
      transactionId,
      paymentStatus: 'pending',
      eventName,
      userName,
      userEmail,
      userPhone,
      eventDate,
      paymentScreenshot
    });

    const resObj = await Registration.findById(newReg._id).populate('eventId', 'title date price type classLink whatsappLink').lean();
    const serialized = {
      ...resObj,
      _id: resObj._id.toString(),
      eventId: resObj.eventId?._id ? { _id: resObj.eventId._id.toString(), title: resObj.eventId.title, date: resObj.eventId.date, price: resObj.eventId.price, type: resObj.eventId.type, classLink: resObj.eventId.classLink || '', whatsappLink: resObj.eventId.whatsappLink || '' } : null,
    };

    return res.status(200).json({ success: true, status: 'success', registration: serialized });
  }

  return res.status(400).json({ error: 'Invalid action.' });
}
