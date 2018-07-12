import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTodoAssignComponent } from './edit-todo-assign.component';

describe('EditTodoAssignComponent', () => {
  let component: EditTodoAssignComponent;
  let fixture: ComponentFixture<EditTodoAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTodoAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTodoAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
