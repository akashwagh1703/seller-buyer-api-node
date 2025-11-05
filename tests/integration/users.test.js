const request = require('supertest');
const app = require('../../src/app');

describe('Users API Integration Tests', () => {
  const testPhone = '9876543210';
  const testOTP = '643215';
  let userId;

  describe('POST /api/v16/users/register_otp', () => {
    it('should register a new user and send OTP', async () => {
      const res = await request(app)
        .post('/api/v16/users/register_otp')
        .set('X-API-KEY', process.env.API_KEY)
        .set('domain', 'test.famrut.com')
        .set('appname', 'master_uat')
        .send({
          phone: testPhone,
          first_name: 'Test',
          last_name: 'User',
          btn_submit: 'submit'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user_id');
      userId = res.body.data.user_id;
    });
  });

  describe('POST /api/v16/users/verify_otp', () => {
    it('should verify OTP successfully', async () => {
      const res = await request(app)
        .post('/api/v16/users/verify_otp')
        .set('X-API-KEY', process.env.API_KEY)
        .set('domain', 'test.famrut.com')
        .set('appname', 'master_uat')
        .send({
          phone: testPhone,
          otp: testOTP
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/v16/users/login_otp', () => {
    it('should login user with OTP', async () => {
      const res = await request(app)
        .post('/api/v16/users/login_otp')
        .set('X-API-KEY', process.env.API_KEY)
        .set('domain', 'test.famrut.com')
        .set('appname', 'master_uat')
        .send({
          phone: testPhone,
          otp: testOTP
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user_id');
      expect(res.headers).toHaveProperty('authorization');
    });
  });
});
