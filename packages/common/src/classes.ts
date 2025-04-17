export class BaseService {
  get serviceName() {
    return this.constructor.name;
  }
}
