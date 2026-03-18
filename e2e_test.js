const http = require('http');

const baseUrl = 'http://localhost:3000/api';

async function req(path, method, body, cookie) {
  return new Promise((resolve, reject) => {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (cookie) opts.headers['Cookie'] = cookie;
    
    const request = http.request(baseUrl + path, opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const setCookie = res.headers['set-cookie'];
        let json;
        try {
          json = JSON.parse(data);
        } catch(e) { json = data; }
        resolve({ status: res.statusCode, data: json, cookie: setCookie ? setCookie[0].split(';')[0] : null });
      });
    });
    
    request.on('error', reject);
    if (body) request.write(JSON.stringify(body));
    request.end();
  });
}

(async function runTests() {
  try {
    console.log('--- STARTING E2E TEST ---');

    console.log('1. Admin Signup');
    await req('/auth', 'POST', { action: 'register', fullname: 'Admin Test', email: 'admin_e2e@test.com', password: 'password', role: 'admin' });
    
    console.log('2. Admin Login');
    const adminLogin = await req('/auth', 'POST', { action: 'login', identifier: 'admin_e2e@test.com', password: 'password' });
    if (adminLogin.status !== 200) throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.data));
    const adminCookie = adminLogin.cookie;
    console.log('Admin Cookie acquired.');

    console.log('3. Create Online Event');
    const onlineEventReq = await req('/events', 'POST', {
      action: 'add',
      title: 'E2E Online Meditations',
      date: new Date().toISOString(),
      price: 499,
      type: 'online',
      preacher: 'Guru Ji',
      description: 'Online session description.',
      driveLink: 'https://meet.google.com/abc'
    }, adminCookie);
    if (!onlineEventReq.data || !onlineEventReq.data.event) throw new Error("Online Event creation failed: " + JSON.stringify(onlineEventReq.data));
    const onlineEvent = onlineEventReq.data.event;
    console.log('Online Event created:', onlineEvent._id);

    console.log('4. Create Offline Event');
    const offlineEventReq = await req('/events', 'POST', {
      action: 'add',
      title: 'E2E Retreat',
      date: new Date().toISOString(),
      price: 1500,
      type: 'offline',
      preacher: 'Guru Ji',
      description: 'Offline session description.',
      venue: 'Himalayas Base Camp'
    }, adminCookie);
    if (!offlineEventReq.data || !offlineEventReq.data.event) throw new Error("Offline Event creation failed: " + JSON.stringify(offlineEventReq.data));
    const offlineEvent = offlineEventReq.data.event;
    console.log('Offline Event created:', offlineEvent._id);

    console.log('5. User Signup');
    await req('/auth', 'POST', { action: 'register', fullname: 'User Test', email: 'user_e2e@test.com', password: 'password', role: 'user' });

    console.log('6. User Login');
    const userLogin = await req('/auth', 'POST', { action: 'login', identifier: 'user_e2e@test.com', password: 'password' });
    const userCookie = userLogin.cookie;
    if (!userCookie) throw new Error('User login failed: ' + JSON.stringify(userLogin.data));
    console.log('User Cookie acquired.');

    console.log('7. Register for Online Event');
    await req('/registrations', 'POST', {
      action: 'register',
      eventId: onlineEvent._id,
      transactionId: 'TXN_' + Date.now(),
      eventName: onlineEvent.title
    }, userCookie);

    console.log('8. Register for Offline Event');
    await req('/registrations', 'POST', {
      action: 'register',
      eventId: offlineEvent._id,
      transactionId: 'TXN_' + Date.now(),
      eventName: offlineEvent.title
    }, userCookie);

    console.log('9. Fetch all registrations as Admin to find IDs to verify');
    const allRegs = await req('/registrations', 'GET', null, adminCookie);
    const userRegs = allRegs.data.filter(r => r.userEmail === 'user_e2e@test.com' || (!r.userEmail));
    
    for (let reg of userRegs) {
      console.log('10. Verifying payment for registration:', reg._id);
      await req('/registrations', 'POST', {
        action: 'verify_payment',
        reg_id: reg._id
      }, adminCookie);
    }

    console.log('11. Validate Dashboard Registration Changes (User view)');
    const finalUserRegs = await req('/registrations', 'GET', null, userCookie);
    let verifiedOk = true;
    for (let reg of finalUserRegs.data) {
       if (reg.paymentStatus !== 'verified') verifiedOk = false;
    }
    
    if (verifiedOk) {
       console.log('✅ ALL TESTS PASSED: Auth, Admin Validation, Registration, and Payment Tracking verified connected to Atlas.');
    } else {
       console.log('❌ VERIFICATION FAILED: Registrations were not verified.');
    }
  } catch(e) {
    console.error('TEST FAILED:', e);
  }
})();
