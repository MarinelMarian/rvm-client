import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '@app/core/service/users.service';
import { EmailValidation } from '@app/core/validators/email-validation';
import { PhoneValidation } from '@app/core/validators/phone-validation';
import { AuthenticationService } from '@app/core';

@Component({
	selector: 'app-add-user',
	templateUrl: './add-user.component.html',
	styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit {
	form: FormGroup;
	role: string;
	id: string;
	user: any = {};
	currentUserRole = '';
	loading = false;

	constructor(private fb: FormBuilder,
		private router: Router,
		public route: ActivatedRoute,
		public authService: AuthenticationService,
		private usersService: UsersService) { }

	ngOnInit() {
		this.form = this.fb.group({
			name: ['', Validators.required],
			email: ['', [ Validators.required, EmailValidation.emailValidation ]],
			phone: ['', [ Validators.required, PhoneValidation.phoneValidation ]],
			institution: ['']
		});

		this.currentUserRole = this.authService.accessLevel;

		if (this.route.snapshot.paramMap.get('role')) {
			this.role = this.route.snapshot.paramMap.get('role');
		}


		if (this.route.snapshot.paramMap.get('id')) {
			this.id = this.route.snapshot.paramMap.get('id');

			this.getData();
		}
	}

	getData() {
		this.usersService.getUser(this.id).subscribe(response => {
			this.user = response;
			this.role = this.user.role;
			this.editForm();
		});
	}

	editForm() {
		this.form.controls['name'].setValue(this.user.name);
		this.form.controls['email'].setValue(this.user.email);
		this.form.controls['phone'].setValue(this.user.phone);
	}

	onSubmit() {
		this.loading = true;
		this.user.name = this.form.value.name;
		this.user.email = this.form.value.email;
		this.user.phone = this.form.value.phone;

		if (this.role) {
			this.user.role = this.role;

			if (this.role === '1' || this.role === '0') {
				this.user.institution = this.form.value.institution;
			}
		}

		if (this.user._id) {
			// edit
			this.usersService.updateUser(this.user).subscribe((response) => {
				this.loading = false;
				this.router.navigate(['users']);
			}, () => {
				this.loading = false;
			});
		} else {
			// add
			this.usersService.addUser(this.user).subscribe((response) => {
				this.loading = false;
				this.router.navigate(['users']);
			}, () => {
				this.loading = false;
			});
		}
	}
}
