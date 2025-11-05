import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {

  private maxRetries = 3;
  private delayMs = 1000;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, retryCount) => {
            if (retryCount < this.maxRetries && this.shouldRetry(error)) {
              return timer(this.delayMs);
            } else {
              return throwError(() => error);
            }
          })
        )
      )
    );
  }

  private shouldRetry(error: HttpErrorResponse): boolean {
    return error.status === 0 || (error.status >= 500 && error.status < 600);
  }
}
