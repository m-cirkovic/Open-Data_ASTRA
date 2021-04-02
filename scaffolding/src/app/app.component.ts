import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scaffolding';

  results: string[];

  constructor(private httpClient: HttpClient) {
    console.log('constructor opened');
  }

  onClickMe() {
    const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tdpplv1="http://datex2.eu/wsdl/TDP/Soap_Datex2/Pull/v1" xmlns:dx223="http://datex2.eu/schema/2/2_0">\n' +
      '              <SOAP-ENV:Body>\n' +
      '                             <dx223:d2LogicalModel xsi:type="dx223:D2LogicalModel" modelBaseVersion="2">\n' +
      '                                           <dx223:exchange xsi:type="dx223:Exchange">\n' +
      // tslint:disable-next-line:max-line-length
      '                                                          <dx223:supplierIdentification xsi:type="dx223:InternationalIdentifier">\n' +
      '                                                          <dx223:country xsi:type="dx223:CountryEnum">de</dx223:country>\n' +
      '                                                          <dx223:nationalIdentifier xsi:type="dx223:String">FEDRO</dx223:nationalIdentifier>\n' +
      '                                                          </dx223:supplierIdentification>\n' +
      '                                           </dx223:exchange>\n' +
      '                             </dx223:d2LogicalModel>\n' +
      '              </SOAP-ENV:Body>\n' +
      '</SOAP-ENV:Envelope>\n';
    const url = 'https://api.opentransportdata.swiss/TDP/Soap_Datex2/Pull';

    this.httpClient.post(url, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .append('Authorization', '57c5dbbbf1fe4d0001000018543da6f8789f4f868587d0de6163eccd')
        .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method')
        .append('SOAPAction', 'http://opentransportdata.swiss/TDP/Soap_Datex2/Pull/v1/pullMeasuredData')
        .append('SOAPAction', 'http://opentransportdata.swiss/TDP/Soap_Datex2/Pull/v1/pullMeasurementSiteTable')
    }).subscribe(data => {
      console.log(data);
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      }
    );
  }
}
