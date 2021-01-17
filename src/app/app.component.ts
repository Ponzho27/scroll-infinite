import { Component, HostListener, OnInit } from '@angular/core';
import { CharactersService } from './providers/characters.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'scroll-inifite';
  
  rickandmorty: Array<object>;
  nextPage: string; 
  totalPage: number = 1;
  countPage: number = 1;
  loading: boolean = true;
  nameEpi:string;
  dayEpi: string;
  loadingEpi: boolean = true;
  

  private finishPage = 5;
  private actualPage: number;
  showGoUpButton: boolean;
  showScrollHeight = 400;
  hideScrollHeight = 200;

  @HostListener('window:scroll', [])
    onWindowScroll() {
      if (( window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop) > this.showScrollHeight) {
        this.showGoUpButton = true;
      } else if ( this.showGoUpButton &&
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop)
        < this.hideScrollHeight) {
        this.showGoUpButton = false;
      }
    }

  constructor(
    private characterService: CharactersService,
    private _sanitizer: DomSanitizer
  ){
    this.showGoUpButton = false;
  }

  /**
   * Realiza el trust url
   * @param image Url de la imagen
   */
  getImage(image) {
    return this._sanitizer.bypassSecurityTrustUrl(`${image}`);
  }

  /**
   * Regresa al top el scroll
   */
  scrollTop() {
      document.body.scrollTop = 0; // Safari
      document.documentElement.scrollTop = 0; // Other
  }

  /**
   * Detecta cuando haya un cambio en el scroll
   */
  onScroll() {
    if (this.countPage < this.totalPage) {
      this.getNewCharacters();
      this.countPage++;
    } else {
      console.log('No more lines. Finish page!');
    }
  }

  /**
   * Obtiene la informacio`n del caracter y muestra modal
   */
  showInfo(url){
    console.log(url)
    this.loadingEpi = true;
    $("#infoModal").modal('show');
    this.characterService.getCharacterInfo(url).subscribe(
      res => {
        this.characterService.getEpisodeInfo(res['episode'][0]).subscribe(
          epi => {
            this.nameEpi = epi['name'];
            this.dayEpi = epi['air_date'];
            this.loadingEpi = false;
          }
        );

      }
    );
  }

  /**
   * Cierra el modal presentado
   */
  closeModal(){
    $("#infoModal").modal('hide');
  }

  /**
   * Realiza la petición para los nuevos caracteres
   */
  getNewCharacters(){
    if(this.countPage < this.totalPage){
      this.characterService.getCharacters(this.nextPage).subscribe(res => {
        if(res['results']['length'] >= 1){
          
          // Añadir los caracteres
          for (let i = 0; i < res['results']['length']; i++) {
            const character = res['results'][i];
            this.rickandmorty.push(character);
          }

          // Actualiza los valores de paginas y totales
          this.nextPage = res['info']['next'];
          this.totalPage = res['info']['pages'];
          console.log(this.rickandmorty);

        }
      });
    }
  }

  ngOnInit() {
    // Realiza la primera petición de los caracteres
    this.characterService.getCharacters().subscribe(res => {
      if(res['results']['length'] >= 1){
        this.rickandmorty = res['results'];
        this.nextPage = res['info']['next'];
        this.totalPage = res['info']['pages'];
        console.log(this.rickandmorty);
        this.loading = false;
      }
    });
  }
}
