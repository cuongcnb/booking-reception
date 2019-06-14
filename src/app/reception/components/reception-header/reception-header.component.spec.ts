import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionHeaderComponent } from './reception-header.component';

describe('ReceptionHeaderComponent', () => {
  let component: ReceptionHeaderComponent;
  let fixture: ComponentFixture<ReceptionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
