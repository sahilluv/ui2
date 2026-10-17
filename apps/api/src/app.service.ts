export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'shadow-api',
      timestamp: new Date().toISOString(),
    };
  }
}
