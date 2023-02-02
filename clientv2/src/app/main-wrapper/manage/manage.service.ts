import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { User, UserFields } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  users: BehaviorSubject<User[]> = new BehaviorSubject([] as User[])

  constructor(private apiService: ApiService) { }

  newUser: User = {
    login: '',
    password: '',
    displayName: '',
    shortName: '',
    emoticon: '',
    primaryEmoticon: '',
    isAdmin: false
  }

  getUsers(): void {
    this.apiService.getUserForManage().subscribe({
      next: (res) => this.users.next(res),
      error: (e) => {
        //TODO: Handle error
      }
    })
  }

  addUser(user: User): Observable<User[]> {
    return this.apiService.addNewUser(user)
  }

  deleteUser(userId: string): Observable<User[]> {
    return this.apiService.deleteUser(userId)
  }

  editUser(userFields: UserFields): Observable<User[]> {
    return this.apiService.editUser(userFields)
  }
}
