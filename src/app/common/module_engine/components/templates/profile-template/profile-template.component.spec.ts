import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTemplateComponent } from './profile-template.component';

describe('UserProfileTemplateComponent', () => {
  let component: ProfileTemplateComponent;
  let fixture: ComponentFixture<ProfileTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
