import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    profileForm!: FormGroup;
    profilePhotoUrl: string | null = null;
    userId: string = '';
    lessonsCompleted: number = 0;
    editingName = false;
    showPopup = false;
    popupMessage = '';
    popupAction: () => void = () => {};
    originalName = '';
    showPhotoPopup = false;
    photoUrlInput = '';
    selectedFile: File | null = null;
    photoError: string = '';
    previewFileUrl: string | null = null;

    constructor(
        private fb: FormBuilder,
        private afAuth: AngularFireAuth,
        private firestore: Firestore,
        private router: Router,
        private storage: AngularFireStorage,
        private authService: AuthService
    ) {}

    

    ngOnInit(): void {
        this.afAuth.authState.subscribe(async user => {
        if (!user) {
            this.router.navigate(['/login']);
            return;
        }

        this.userId = user.uid;
        const userRef = doc(this.firestore, 'usuarios', this.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data() as any;

        this.profileForm = this.fb.group({
            name: [data.nome || '', Validators.required],
            email: [{ value: data.email || '', disabled: true }]
        });

        this.profilePhotoUrl = data.fotoUrl || null;
        this.lessonsCompleted = data.aulasConcluidas || 0;
        this.originalName = data.nome || '';

        }
    });
}

    async onPhotoSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.previewFileUrl = URL.createObjectURL(file);
            this.photoUrlInput = '';
         }
    }

    async uploadFromUrl() {
        this.photoError = '';

        if (this.selectedFile && this.photoUrlInput) {
            this.photoError = 'Só é permitido escolher um método de imagem.';
            return;
        }

        if (!this.userId) return;

        if (this.selectedFile) {
            const filePath = `profile_photos/${this.userId}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(filePath, this.selectedFile);

            task.snapshotChanges().pipe(
                finalize(async () => {
                    const url = await fileRef.getDownloadURL().toPromise();
                    this.profilePhotoUrl = url;
                    const userRef = doc(this.firestore, 'usuarios', this.userId);
                    await updateDoc(userRef, { fotoUrl: url });
                    await this.authService.reloadUserData();
                    this.closePhotoPopup();
                })
            ).subscribe();
        } else if (this.photoUrlInput) {
            const userRef = doc(this.firestore, 'usuarios', this.userId);
            await updateDoc(userRef, { fotoUrl: this.photoUrlInput });
            this.profilePhotoUrl = this.photoUrlInput;
            await this.authService.reloadUserData();
            this.closePhotoPopup();
        }
    }

    previewImage() {
        this.photoError = '';
        if (this.selectedFile && this.photoUrlInput) {
            this.photoError = 'Só é permitido escolher um método de imagem.';
            return;
        }

        if (this.selectedFile) {
            this.previewFileUrl = URL.createObjectURL(this.selectedFile);
        } else if (this.photoUrlInput) {
            this.previewFileUrl = this.photoUrlInput;
        } else {
            this.previewFileUrl = null;
        }
    }

    clearSelectedFile() {
        this.selectedFile = null;
        this.previewFileUrl = null;
    }

        cancelEditName() {
            this.profileForm.get('name')?.setValue(this.originalName);
            this.editingName = false;
        }

        toggleEditName() {
            if (!this.editingName) {
                this.originalName = this.profileForm.get('name')?.value || '';
            }
            this.editingName = !this.editingName;
        }

        confirmSave() {
            this.saveChanges();
            //this.popupMessage = 'Deseja salvar o novo nome?';
            //this.popupAction = () => this.saveChanges();
            //this.showPopup = true;
        }

        async saveChanges() {
            if (!this.userId || this.profileForm.invalid) return;

            const userRef = doc(this.firestore, 'usuarios', this.userId);
            const name = this.profileForm.get('name')?.value;
            const photoUrl = this.profileForm.get('photoUrl')?.value;

        try {
            const updateData: any = { nome: name };

            if (this.profilePhotoUrl) {
                updateData.fotoUrl = this.profilePhotoUrl;
            }
            console.log('Enviando para Firestore:', name);

            await updateDoc(userRef, updateData);
            await this.authService.reloadUserData()

            this.editingName = false;
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
        }
    }

        confirmDelete() {
            console.log('confirmDelete chamado');
            this.popupMessage = 'Tem certeza que deseja excluir sua conta?';
            this.popupAction = () => this.deleteAccount();
            this.showPopup = true;
        }

        async deleteAccount() {
            const user = await this.afAuth.currentUser;
            if (!user || !this.userId) return;

            try {
                const userRef = doc(this.firestore, 'usuarios', this.userId);
                await updateDoc(userRef, { deletadoEm: new Date() });
                await user.delete();
                this.router.navigate(['/register']);
                } catch (error) {
                console.error('Erro ao excluir conta:', error);
            }
        }

        openPhotoOptions() {
            this.showPhotoPopup = true;
        }

        closePhotoPopup() {
            this.showPhotoPopup = false;
            this.photoUrlInput = '';
            this.selectedFile = null;
            this.previewFileUrl = null;
            this.photoError = '';
        }

        // Funções do popup
        popupConfirm() {
            console.log('popupConfirm clicado');
            this.showPopup = false;
            this.popupAction();
        }

        popupCancel() {
            this.showPopup = false;
}
    }