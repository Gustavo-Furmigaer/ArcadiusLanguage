import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SpeechToggleComponent } from './speech-toggle.component';
import { AccessibilityService } from '../../core/services/accessibility.service';

describe('SpeechToggleComponent', () => {
  let component: SpeechToggleComponent;
  let fixture: ComponentFixture<SpeechToggleComponent>;
  let service: AccessibilityService;

  // Stub para o serviço, com spy no método toggleSpeech
  const accessibilityServiceStub = {
    toggleSpeech: jasmine.createSpy('toggleSpeech')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SpeechToggleComponent ],
      providers: [
        { provide: AccessibilityService, useValue: accessibilityServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpeechToggleComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AccessibilityService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle speech state and call service with correct value', () => {
    // estado inicial definido como `true`
    expect(component.isSpeechEnabled).toBeTrue();

    // 1º clique: desativa
    component.toggleSpeech();
    expect(component.isSpeechEnabled).toBeFalse();
    expect(service.toggleSpeech).toHaveBeenCalledWith(false);

    // 2º clique: reativa
    component.toggleSpeech();
    expect(component.isSpeechEnabled).toBeTrue();
    expect(service.toggleSpeech).toHaveBeenCalledWith(true);
  });
});
