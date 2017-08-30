import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';

@Injectable()
export class StarWarsService {
    private characters = [
    { name: 'Luke Skywalker', side: '' },
    { name: 'Darth Vader', side: '' }
  ];

  private logService: LogService;

  //provided by rxjs
  charactersChanged = new Subject<void>();
  http: Http;

  constructor(logService: LogService, http: Http) {
    this.logService = logService;
    this.http = http;
  }

  fetchCharacters() {
    this.http.get('https://swapi.co/api/people/')
    .map((response: Response) => {
        const data = response.json();
        const extractedChars = data.results;
        const chars = extractedChars.map((char)=> {
            return {name: char.name, side: ''}
        });
        return chars;
    })
    .subscribe(
        (data) => {
            console.log(data);
            this.characters = data;
            this.charactersChanged.next();
        }
    )
  }

getCharacters(chosenList) {
  if (chosenList === 'all')  {
    //not to alter the original array
    return this.characters.slice();
  }
  return this.characters.filter((char) => {
      return char.side === chosenList;
  });
}

onSideChosen(charInfo) {
    const pos = this.characters.findIndex(char => {
      return char.name === charInfo.name;
    })
    this.characters[pos].side = charInfo.side;
    this.charactersChanged.next();
    this.logService.writeLog('Changed side of ' + charInfo.name + ', new Side:' + charInfo.side);
  }

  addCharacter(name, side) {
      const pos = this.characters.findIndex(char => {
          return char.name === name;
      })
      if(pos !== -1) {
          return;
      }
      const char = {name:name, side: side};
      this.characters.push(char);
  }

}