import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMetadataComponent } from './create-metadata.component';

describe('CreateMetadataComponent', () => {
  let component: CreateMetadataComponent;
  let fixture: ComponentFixture<CreateMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
