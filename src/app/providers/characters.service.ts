import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(
    private http: HttpClient
  ) { }

  getCharacters(nextPage?){

    let url = (nextPage) ? nextPage: `${environment.urlBack}character`;
    return this.http.get(url);

  }


  getCharacterInfo(url){
    return this.http.get(url);
  }

  getEpisodeInfo(url){
    return this.http.get(url);
  }

}
