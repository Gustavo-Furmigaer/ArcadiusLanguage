import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSimulator } from './game-simulator';

describe('GameSimulator', () => {
  let component: GameSimulator;
  let fixture: ComponentFixture<GameSimulator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSimulator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSimulator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
