import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRendererComponent } from './file-renderer.component';

describe('FileRendererComponent', () => {
  let component: FileRendererComponent;
  let fixture: ComponentFixture<FileRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
