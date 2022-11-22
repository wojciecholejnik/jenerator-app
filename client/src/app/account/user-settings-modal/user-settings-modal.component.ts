import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from 'src/app/toast/toast.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-user-settings-modal',
  templateUrl: './user-settings-modal.component.html',
  styleUrls: ['./user-settings-modal.component.scss']
})
export class UserSettingsModalComponent implements OnInit, AfterContentInit {

  @Output('closeModalEmitter') closeModalEmitter: EventEmitter<any> = new EventEmitter();
  @Input() type: any;

  modalContainer: HTMLElement | null = null;
  backgroundColor: string | null = null;

  requestPending = false;
  requestError = false;

  modalForPasswordChange = false;
  modalForNameChange = false;
  modalForLoginChange = false;
  modalForEmoticonChange = false;
  modalForBackgroundChange = false;

  newPassword = '';
  newName = '';
  newLogin = '';
  newEmoticon = '';
  newColor = '';

  constructor(private userService: UserService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.modalForPasswordChange = this.type === 'passwordChange';
    this.modalForNameChange = this.type === 'nameChange';
    this.modalForLoginChange = this.type === 'loginChange';
    this.modalForEmoticonChange = this.type === 'emoticonChange';
    this.modalForBackgroundChange = this.type === 'backgroundChange';
  }

  ngAfterContentInit(): void {
    this.modalContainer = document.getElementById('modal-container');
    this.backgroundColor = localStorage.getItem('background')
    if (this.modalContainer && this.backgroundColor) {
      this.modalContainer.style.background = this.backgroundColor;
    }
  }

  closeModal(){
    this.closeModalEmitter.emit();
  }

  inputInvalid() {
    return this.newPassword.length || this.newName.length || this.newLogin.length || this.newEmoticon.length || this.newColor.length
  }

  setNewColor(event: any) {
    if (this.modalContainer && this.newColor.length) {
      this.modalContainer.style.background = (event.target.value);
    } else if (this.modalContainer && this.backgroundColor) {
      this.modalContainer.style.background = this.backgroundColor;
    }
  }

  save() {
    this.requestPending = true;
    const userId = sessionStorage.getItem('userId');
    if (userId && this.newPassword.length) {
      this.userService.changePassword({userId: userId, newPassword: this.newPassword}).subscribe({
        next: () => {
          this.newPassword = '';
          this.requestPending = false;
          this.toastService.show('hasło zostało zmienione !', { classname: 'bg-success text-light', delay: 5000 });
        },
        error: () => {
          this.requestPending = false;
          this.requestError = true;
          this.toastService.show('nie udało się zapisać zmian :(', { classname: 'bg-danger text-light', delay: 5000 });
        }
      })
    }
    if (userId && this.newName.length) {
      this.userService.changeName({userId: userId, newName: this.newName}).subscribe({
        next: () => {
          this.newName = '';
          this.requestPending = false;
          this.toastService.show('nazwa została zmieniona !', { classname: 'bg-success text-light', delay: 5000 });
        },
        error: () => {
          this.requestPending = false;
          this.requestError = true;
          this.toastService.show('nie udało się zapisać zmian :(', { classname: 'bg-danger text-light', delay: 5000 });
        }
      })
    }
    if (userId && this.newLogin.length) {
      this.userService.changeLogin({userId: userId, newLogin: this.newLogin}).subscribe({
        next: () => {
          this.newLogin = '';
          this.requestPending = false;
          this.toastService.show('login został zmieniony !', { classname: 'bg-success text-light', delay: 5000 });
          
        },
        error: () => {
          this.requestPending = false;
          this.requestError = true;
          this.toastService.show('nie udało się zapisać zmian :(', { classname: 'bg-danger text-light', delay: 5000 });
        }
      })
    }
    if (userId && this.newEmoticon.length) {
      this.userService.changeEmoticon({userId: userId, newEmoticon: this.newEmoticon}).subscribe({
        next: () => {
          this.newEmoticon = '';
          this.requestPending = false;
          this.toastService.show('emotka została zmieniona !', { classname: 'bg-success text-light', delay: 5000 });
        },
        error: () => {
          this.requestPending = false;
          this.requestError = true;
          this.toastService.show('nie udało się zapisać zmian :(', { classname: 'bg-danger text-light', delay: 5000 });
        }
      })
    }
    if (userId && this.newColor.length) {
      this.userService.changeBackground({userId: userId, newBackground: this.newColor}).subscribe({
        next: () => {
          localStorage.setItem('background', this.newColor);
          document.body.style.background = this.newColor;
          this.newColor = '';
          this.requestPending = false;
          this.toastService.show('kolor został zmieniony !', { classname: 'bg-success text-light', delay: 5000 });
        },
        error: () => {
          this.requestPending = false;
          this.requestError = true;
          this.toastService.show('nie udało się zapisać zmian :(', { classname: 'bg-danger text-light', delay: 5000 });
        }
      })
    }
    if (!this.newColor) {
      this.userService.logOut();
    }
    this.closeModal();
  }

}
