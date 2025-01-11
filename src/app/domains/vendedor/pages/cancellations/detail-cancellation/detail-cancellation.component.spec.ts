import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCancellationComponent } from './detail-cancellation.component';

describe('DetailCancellationComponent', () => {
  let component: DetailCancellationComponent;
  let fixture: ComponentFixture<DetailCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCancellationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
