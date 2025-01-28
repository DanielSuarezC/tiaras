import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddinsumosComponent } from './addinsumos.component';

describe('AddinsumosComponent', () => {
  let component: AddinsumosComponent;
  let fixture: ComponentFixture<AddinsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddinsumosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddinsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
