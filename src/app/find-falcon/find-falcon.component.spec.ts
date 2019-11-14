import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindFalconComponent } from './find-falcon.component';

describe('FindFalconComponent', () => {
  let component: FindFalconComponent;
  let fixture: ComponentFixture<FindFalconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindFalconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindFalconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
