import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Language } from '../../core/models/language.model';

@Component({
  selector: 'app-language-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './language-management.component.html',
  styleUrls: ['./language-management.component.scss']
})
export class LanguageManagementComponent implements OnInit {
  languages$!: Observable<Language[]>;
  languageForm: FormGroup;
  editMode = false;
  currentLanguageId: string | null = null;

  constructor(private languageService: LanguageService, private fb: FormBuilder) {
    this.languageForm = this.fb.group({
      name: ['', Validators.required],
      flag: ['', Validators.required],
      culturalCuriosities: this.fb.array([]),
      games: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadLanguages();
  }

  get culturalCuriosities() {
    return this.languageForm.get('culturalCuriosities') as FormArray;
  }

  addCuriosity() {
    this.culturalCuriosities.push(this.fb.control(''));
  }

  removeCuriosity(index: number) {
    this.culturalCuriosities.removeAt(index);
  }

  loadLanguages(): void {
    this.languages$ = this.languageService.getLanguages();
  }

  addLanguage(): void {
    if (this.languageForm.valid) {
      const newLanguage: Language = {
        ...this.languageForm.value,
        games: []
      };
      this.languageService.createLanguage(newLanguage).subscribe(() => {
        this.loadLanguages();
        this.resetForm();
      });
    }
  }

  updateLanguage(): void {
    if (this.languageForm.valid && this.currentLanguageId) {
      const updatedLanguage: Partial<Language> = this.languageForm.value;
      this.languageService.updateLanguage(this.currentLanguageId, updatedLanguage).subscribe(() => {
        this.loadLanguages();
        this.resetForm();
      });
    }
  }

  deleteLanguage(id: string): void {
    this.languageService.deleteLanguage(id).subscribe(() => {
      this.loadLanguages();
    });
  }

  editLanguage(language: Language): void {
    this.editMode = true;
    this.currentLanguageId = language.id!;
    this.languageForm.patchValue({
      name: language.name,
      flag: language.flag
    });
    this.culturalCuriosities.clear();
    language.culturalCuriosities.forEach(curiosity => {
      this.culturalCuriosities.push(this.fb.control(curiosity));
    });
  }

  resetForm(): void {
    this.editMode = false;
    this.currentLanguageId = null;
    this.languageForm.reset();
    this.culturalCuriosities.clear();
  }

  onSubmit(): void {
    if (this.editMode) {
      this.updateLanguage();
    } else {
      this.addLanguage();
    }
  }
}
