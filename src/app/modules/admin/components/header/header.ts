import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
 standalone:false,
  templateUrl: './header.html',
})
export class Header {

  constructor() { }

  onSearch = (event: Event) => {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'k') {
      console.log('Ctrl + K');
    }
  }
  
}
