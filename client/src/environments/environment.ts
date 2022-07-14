// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://192.168.1.4:3000',
  localHost: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000',
  // apiUrl: 'https://warehouse-grad.herokuapp.com',
  paypalsecret: 'Af_w-ScQbLbrSqrwJKRuESd71ZLtKNG2zUf3YuJndpV3YF8JOninuSUt6yeDG3QZaRs1qOv19lrDhaV0',
  stripeKey: 'pk_test_51IAtnlKMAtDRnFQfeMLEaqLtzwx7w6lMmQfYab9sTkDUrXttEalyvJVWq4OFSb1Okz4FerdT2QIJMOmCOKnC4ECX00nlQPfzTu'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
