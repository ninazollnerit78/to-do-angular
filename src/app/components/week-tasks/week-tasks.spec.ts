import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekTasks } from './week-tasks';

describe('WeekTasks', () => {
  let component: WeekTasks;
  let fixture: ComponentFixture<WeekTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
