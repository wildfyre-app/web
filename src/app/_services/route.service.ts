import { Injectable } from '@angular/core';

@Injectable()
export class RouteService {
  routes: string[] = [];

  public constructor() { }

  addNextRoute(route: string) {
    this.routes[this.routes.length] = route;
  }

  deleteLastRoute() {
    this.routes = this.routes.splice(this.routes.length, 1);
  }

  getNextRoute(): string {
    const route = this.routes[this.routes.length - 1];
    this.deleteLastRoute();
    return route;
  }
}
