import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTodoTitleComponent } from './edit-todo-title.component';

describe('EditTodoTitleComponent', () => {
  let component: EditTodoTitleComponent;
  let fixture: ComponentFixture<EditTodoTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTodoTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTodoTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
