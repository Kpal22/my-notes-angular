import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PasswordService {

  // tslint:disable-next-line: max-line-length
  private A2Z = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // tslint:disable-next-line: max-line-length
  private a2z = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  private symbol = ['!', '#', '$', '_', '-', '*', '.', '+', '&', '@'];

  generatePass = (length: number) => {

    const round = Math.ceil(length / 4);
    let pass = '';
    let choose: number[];
    const A2Zdone: number[] = [];
    const a2zdone: number[] = [];
    const symboldone: number[] = [];
    const numdone: number[] = [];
    for (let i = 0; i < round; i++) {
      choose = [];
      while (choose.length < 4) {
        const chosen = Math.floor(Math.random() * 4) + 1;
        choose.push(chosen);
        switch (chosen) {
          case 1:
            while (true) {
              const A2ZSelcted = Math.floor(Math.random() * 26);
              if (A2Zdone.includes(A2ZSelcted)) {
                continue;
              } else {
                A2Zdone.push(A2ZSelcted);
                pass += this.A2Z[A2ZSelcted];
                break;
              }
            }
            break;
          case 2:
            while (true) {
              const a2zSelcted = Math.floor(Math.random() * 26);
              if (a2zdone.includes(a2zSelcted)) {
                continue;
              } else {
                a2zdone.push(a2zSelcted);
                pass += this.a2z[a2zSelcted];
                break;
              }
            }
            break;
          case 3:
            while (true) {
              const sybmolSelcted = Math.floor(Math.random() * 10);
              if (symboldone.includes(sybmolSelcted)) {
                continue;
              } else {
                symboldone.push(sybmolSelcted);
                pass += this.symbol[sybmolSelcted];
                break;
              }
            }
            break;
          case 4:
            while (true) {
              const numSelcted = Math.floor(Math.random() * 10);
              if (numdone.includes(numSelcted)) {
                continue;
              } else {
                numdone.push(numSelcted);
                pass += numSelcted;
                break;
              }
            }
            break;
        }
      }
    }
    return pass.substring(0, length);
  }

  passStrength = (pass: string) => {
    let score = 0;
    const chars: string[] = [];
    let lowercase = false;
    let uppercase = false;
    let symbol = false;
    let num = false;
    pass.split('').forEach((key: any) => {
      if (chars.includes(key)) {
        score += 5;
      } else {
        score += 10;
        if (this.A2Z.includes(key)) {
          if (!uppercase) {
            uppercase = true;
            score += 10;
          }
        } else if (this.a2z.includes(key)) {
          if (!lowercase) {
            lowercase = true;
            score += 10;
          }
        } else if (isNaN(key)) {
          if (!symbol) {
            symbol = true;
            score += 10;
          }
        } else if (!num) {
          num = true;
          score += 10;
        }
      }
      chars.push(key);
    });
    if (uppercase && lowercase && symbol && num) {
      score += 10;
    }

    score = Math.ceil(score / 2);

    if (score > 100) {
      score = 100;
    }

    return score;
  }
}
