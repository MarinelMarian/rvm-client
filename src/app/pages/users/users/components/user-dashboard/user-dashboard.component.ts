import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UsersService } from '@app/core/service/users.service';
import {
	FormGroup,
	Validators,
	FormBuilder
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
	selector: 'app-user-dashboard',
	templateUrl: './user-dashboard.component.html',
	styleUrls: ['./user-dashboard.component.scss']
})

export class UserDashboardComponent implements OnInit {
	data: any = [];
	pagerTotal: String;
	pager = {};
	displayBlock = true;
	form: FormGroup;

	roles = [
		{
			id: 0,
			name: 'Ofițer de intervenție'
		},
		{
			id: 1,
			name: 'Administratorul instituțional'
		},
		{
			id: 2,
			name: 'Administrator ONG'
		},
		{
			id: 3,
			name: 'Administrator DSU'
		},
	];

	constructor(private usersService: UsersService,
		public breakpointObserver: BreakpointObserver,
		private modalService: NgbModal,
		private router: Router,
		private fb: FormBuilder) { }

	ngOnInit() {
		this.pager = this.usersService.getPager();
		this.getData();
		this.breakpointObserver.observe([
			'(max-width: 768px)'
				]).subscribe(result => {
				if (result.matches) {
					this.switchtolist();
				}
			});

			this.form = this.fb.group({
				role: ['', Validators.required]
			});
	}
	getRole(id: string) {
		for (const elem of this.roles) {
			if (elem.id === parseInt(id, 10)) { return elem.name; }
		}
	}
	addUser(content: any) {
		this.modalService.open(content, { centered: true });
	}

	getData() {
		this.usersService.getUsers(this.pager).subscribe(element => {
			if (element.data) {
				this.data = element.data;
				this.pagerTotal = element.pager.total;
			}
		});
	}

	continue() {
		if (this.form.value.role === '2') {
			this.router.navigate(['/organisations/add']);
		} else {
			this.router.navigateByUrl('/users/add/' + this.form.value.role);
		}
		this.modalService.dismissAll();
	}

	/**
	 * set class of display element with list view
	 */
	switchtolist() {
		this.displayBlock = false;
	}
	/**
	 * set class of display element with grid view
	 */
	switchtoblock() {
		this.displayBlock = true;
	}
}