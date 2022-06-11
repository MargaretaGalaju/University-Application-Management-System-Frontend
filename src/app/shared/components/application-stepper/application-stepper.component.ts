import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserService } from 'src/app/features/profile/services/user.service';
import { Faculty } from '../../models/faculty.model';

export interface Task {
  name: string;
  checked: boolean;
  color: string;
  subtasks?: Task[];
}
@Component({
  selector: 'app-application-stepper',
  templateUrl: './application-stepper.component.html',
  styleUrls: ['./application-stepper.component.scss']
})
export class ApplicationStepperComponent implements OnInit {
  public formGroup: FormGroup;

  public get isLoading(): Observable<boolean> {
    return this.loadingService.isLoading$;
  }

  public faculties: any[] = [];

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public fifthFormGroup: FormGroup;

  public fields1: { label: string, formKey: string, isDatePicker: boolean }[];
  public tasks: Task[] = []

  public task: Task = {
    name: 'Indeterminate',
    checked: false,
    color: 'primary',
    subtasks: [
      { name: 'Primary', checked: false, color: 'accent' },
      { name: 'Accent', checked: false, color: 'accent' },
      { name: 'Warn', checked: false, color: 'accent' },
    ],
  };

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly facultyApiService: FacultyApiService,
    private readonly loadingService: LoadingService,
  ) { }

  public ngOnInit(): void {
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.fourthFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.fifthFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.loadingService.stopLoading();

    this.userService.getUser().subscribe((user) => {
      this.firstFormGroup = new FormGroup({
        firstName: new FormControl(user.firstName, [Validators.required]),
        lastName: new FormControl(user.lastName, [Validators.required]),
        middleName: new FormControl(user.middleName, [Validators.required]),
        email: new FormControl(user.email, [Validators.email]),
        phone: new FormControl(user.phone),
        citizenship: new FormControl(user.citizenship, [Validators.required]),
        gender: new FormControl(user.gender, [Validators.required]),
        nationality: new FormControl(user.nationality, []),
        dateOfBirth: new FormControl(user.dateOfBirth, []),
        placeOfBirth: new FormControl(user.placeOfBirth, []),
        idCardSeriesNr: new FormControl(user.idCardSeriesNr, []),
        idDateOfIssue: new FormControl(user.idDateOfIssue, []),
      });

      this.fields1 = Object.keys(this.firstFormGroup.value).map((field) => {
        const label = field.split(/(?=[A-Z])/).map((a, i) => {
          if (i === 0) {
            let firstLetter = a.slice(0, 1).toUpperCase();
            return `${firstLetter.concat(a.slice(1, a.length))}`
          }

          return a.toLowerCase()
        }).join(' ');

        const isDatePicker = ['dateOfBirth', 'placeOfBirth', 'idDateOfIssue'].includes(field);

        return {
          label, formKey: field, isDatePicker
        }
      });
    });

    this.faculties = [{ "id": "0e2aed9e-99eb-41c4-a3ad-a06bf63459e2", "title": "Faculty of Textile and Polygraphy", "info": "Tindem să creăm la facultate un mediu de studiu centrat pe student, în care simbioza teoriei și practicii, pe platforma creativității și inovației, asigură formarea integră a viitorilor specialiști în domeniile textilelor și poligrafiei, cu abilități de design-proiectare și competențe tehnice relevante. Oportunități deosebite pentru studenții facultății noastre oferă Centrul de Excelență și Accelerare în Design și Tehnologii „ZIPhouse” al UTM. De menționat, că absolvenții Facultății Textile și Poligrafie sunt permanent solicitați pe piața muncii, peste 80% dintre aceștia fiind angajați în sectorul industriei ușoare.", "specialties": [{ "id": "5a36db51-2206-489c-9436-5eb175b874f4", "title": "Decorative Arts", "description": "Short Description" }, { "id": "d7992bee-1e69-40ca-a22e-506a6092ab61", "title": "Textile, clothes, footwear and leather processing", "description": "Short Description" }, { "id": "df3f37a0-d189-418a-8706-294b3994ee4b", "title": "Engineering and Industrial Technologies", "description": "Short Description" }] }, { "id": "0f64242d-fda3-4885-8a7f-4624731adfde", "title": "Faculty of Cadastre, Geodesy and Constructions", "info": "Facultatea Construcții, Geodezie și Cadastru (FCGC) de la Universitatea Tehnică a Moldovei este unica unitate din Republica Moldova care pregătește ingineri constructori, ingineri geodezi, ingineri în domeniul ingineriei antiincendii și protecție civilă, ingineriei și management în construcției, juriști cu cunoștințe profunde în patrimoniu, bunuri imobile. Facultatea Construcții, Geodezie și Cadastru (FCGC) de la Universitatea Tehnică a Moldovei are concurenți naționali la pregătirea inginerilor evaluatori ai bunurilor imobile, ingineri cadastrali, ceea ce ne motivează să fim mai competitivi și mai buni.", "specialties": [{ "id": "305ac584-f79f-4b85-9b8b-30c314447b67", "title": "Law", "description": "Short Description" }, { "id": "3b54ed4e-7159-410e-b939-7b4d6a26b279", "title": "Geodesy, topography and mapping", "description": "Short Description" }, { "id": "414ec52c-5137-4992-b548-0c0110e80dda", "title": "Assessment of Real Estate", "description": "Short Description" }, { "id": "b96df09f-f6e0-46f0-8b3a-62b365c6ba28", "title": "Wood processing technology", "description": "Short Description" }, { "id": "c27ca607-dcdf-4eef-8983-7679979816d8", "title": "Engineering and Management in constructions", "description": "Short Description" }, { "id": "dc4ae9bf-1241-461a-aaab-1d7596403011", "title": "Construction and civil engineering", "description": "Short Description" }, { "id": "e408fb58-fa12-404b-8176-591f956dbcbb", "title": "Mining engineering", "description": "Short Description" }, { "id": "ed7df114-a487-4ee7-ba6a-437d4242836d", "title": "Fire Engineering and Civil Protection", "description": "Short Description" }] }, { "id": "13f040e8-f953-4eb4-af06-a56501e10ef0", "title": "Faculty of Engineering and Management in Electronics and Telecommunications", "info": "Inginerii în electronică şi telecomunicaţii îmbogăţesc vieţile noastre prin intermediul inovaţiei şi creativităţii. Specialiştii în acest domeniu sunt la mare căutare, iar salariile oferite sunt printre cele mai competitive de pe piaţă. Facultatea noastră este locul unde studenţii obţin competenţe practice, aplică cele învăţate, implementează idei noi şi experimentează. Suntem pasionaţi de ceea ce facem şi vrem ca studenţii noştri, având cunoştinţele necesare, să aducă schimbări utile în societate.", "specialties": [{ "id": "149bef81-464b-47d5-842d-220f790bf006", "title": "Engineering and Management in Telecommunications", "description": "Short Description" }, { "id": "67961601-f4b6-4c8c-993c-67a5dfb799ff", "title": "Applied electronics", "description": "Short Description" }, { "id": "ccef40cf-8d3d-4b76-b7d6-9de9f9918cce", "title": "Telecommunications networks and software", "description": "Short Description" }, { "id": "e64d8043-4311-4a2c-8963-c67fbf7cb97f", "title": "Radio and television communications", "description": "Short Description" }, { "id": "fe15bb24-c073-42c1-bd2f-3e9a86eabf8d", "title": "Telecommunications technologies and systems", "description": "Short Description" }] }, { "id": "41ba4ac4-5991-4977-a134-7c7750095021", "title": "Faculty of Food Technology", "info": "Facultatea Tehnologia Alimentelor pregăteşte specialişti pentru industria şi unităţile alimentaţiei publice, fiind cea mai mare unitate de învăţământ din domeniul alimentar din R. Moldova. În cadrul facultăţii noastre studenţii explorează domeniul alimentar cu o mare curiozitate, învaţă cu pasiune, obţin abilităţi practice și inovează domeniul.Ne bucurăm că fiecare este  pregătit pentru o carieră interesantă şi căutat în industria alimentară.Absolvenţii noştri sunt angajaţi în instituții și companii locale, naționale sau în mari întreprinderi internaționale, fiind responsabili de controlul calităţii, managementul producţiei, dezvoltarea noilor produse şi promovarea lor pe piaţa agroalimentară.", "specialties": [{ "id": "1c78d580-bca6-486d-a63e-f36263190745", "title": "Technology of Food Production", "description": "Short Description" }, { "id": "8bcbe141-c832-4c3e-979b-65dde31a903d", "title": "Technology and management of catering", "description": "Short Description" }, { "id": "c73f00c8-3e59-4ede-aebe-842361f8ec54", "title": "Industrial Biotechnology", "description": "Short Description" }, { "id": "cffef3e5-6d2a-48c7-bddd-2c5548121e7d", "title": "Technology of Wine and Fermented Products", "description": "Short Description" }, { "id": "da944af5-c4ef-47de-b98f-570518709314", "title": "Public nutrition services", "description": "Short Description" }] }, { "id": "5ec9f43e-b68c-48cc-a983-1463716f8b03", "title": "Faculty of Economic Engineering and Business", "info": "Facultatea Inginerie Economică şi Business reprezintă o comunitate ambiţioasă, cu scopuri mari, unde studenţii pot obţine competenţele necesare pentru o carieră de succes şi un viitor prosper. Suntem recunoscuţi pentru studiile de calitate şi ne mândrim cu absolvenţii noştri care beneficiază de numeroase avantaje la locul de muncă sau au iniţiat propriile afaceri. Programul nostru de studii este focusat pe aspecte teoretice şi multă practică, iar pe parcursul studiilor studenţii sunt ghidaţi şi motivaţi de cadre didactice cu experienţă.Aici îi aşteaptă noi prieteni activi, cursuri interesante, proiecte în care aplică cele învăţate, dar şi multe alte activităţi unde îşi vei dezvoltă gândirea strategică, creativitatea, ideile originale şi talentele.", "specialties": [{ "id": "1e651746-2339-4116-a459-035f6893bc5d", "title": "Accounting", "description": "Short Description" }, { "id": "69cf63c2-8db1-477d-8963-0605f50de0c2", "title": "Business and Administration", "description": "Short Description" }, { "id": "e20ab2be-c74d-4578-93aa-50adb58c39f4", "title": "Marketing and Logistics", "description": "Short Description" }] }, { "id": "78050741-da48-451d-bdc7-e05031aa724e", "title": "Faculty of Mechanical and Industrial Engineering and Transports", "info": "Facultatea de Inginerie Mecanică, Industrială şi Transporturi (FIMIT) a fost organizată odată cu fondarea Institutului Politehnic din Chişinău, la 30 aprilie 1964, initial numindu-se Facultatea de Mecanică.  La FIMIT îşi fac studiile circa 1000 de studenţi învăţământ de licenţă şi master, cu frecvenţă şi cu frecvenţă redusă. Absolvenții facultății sunt capabili să proiecteze şi să fabrice mașini şi echipamente industriale, să garanteze buna funcționare a utilajelor moderne din domeniile industriei alimentare, să asigure managementul proceselor de transport, cât şi exploatarea tehnică a vehiculelor auto.", "specialties": [{ "id": "0ffb2d46-2fbc-4e37-b3d1-e9d5e01ac1ca", "title": "Technology of car construction", "description": "Short Description" }, { "id": "1400881f-ff0d-421e-bf72-c410e86d343e", "title": "Mechanical engineering", "description": "Short Description" }, { "id": "19d286a7-ff34-4c96-a13b-57506bc93185", "title": "Machinery and Production Systems", "description": "Short Description" }, { "id": "4d685c03-c147-404a-9c5e-e7f312a04b22", "title": "Transport and shipping services", "description": "Short Description" }, { "id": "b5771eca-c585-4464-9611-036a045c63ba", "title": "Motor Transport Engineering", "description": "Short Description" }, { "id": "bb986cb0-7766-43b7-88dd-59ba39e8fd81", "title": "Industrial Design", "description": "Short Description" }, { "id": "d8658ac6-dd78-4987-9c8a-f8932e7835db", "title": "Engineering and industrial technologies", "description": "Short Description" }, { "id": "ec7b58e8-11fd-4085-9df1-860bea5c5816", "title": "Transport Engineering and Management", "description": "Short Description" }, { "id": "f018b7a6-4a46-4c52-abe4-54879df70933", "title": "Machinery and Refrigerating installations, air-conditioning systems", "description": "Short Description" }, { "id": "fac5f6f6-231f-4361-b1d2-2e7d9541cb2e", "title": "Rail transport engineering", "description": "Short Description" }, { "id": "fdd75bc7-6c8f-4c5c-af7c-1deb17ed2631", "title": "Product design engineering", "description": "Short Description" }] }, { "id": "d543979a-8a39-4213-9197-84c29d4cf58a", "title": "Faculty of Architecture and Urban Planning", "info": "Facultatea Urbanism şi Arhitectură  combină studiul academic cu activităţi practice, stagii de practică interesante, expoziţii, programe de mobilitate şi concursuri. În prezent FUA este principala structură universitară de stat din ţară care pregăteşte specialişti în domeniul arhitecturii şi urbanismului. Deţinem un loc de frunte în dezvoltarea artei şi culturii naţionale. Promovăm şi implementăm ideile inovative şi noile tehnologii în domeniu. Studenţii noştri se remarcă prin spirit artistic dezvoltat şi prin capacitatea de a crea lucruri inedite. Facultatea asigură cursuri de design, programe postuniversitare  (masterat, doctorat), cursuri pentru conducătorii auto şi încă multe alte facilităţi.", "specialties": [{ "id": "0755e0ef-22f3-4eda-a310-39207b7e3bfc", "title": "Urban planning and landscape management", "description": "Short Description" }, { "id": "1ff46dbb-bc09-4da1-8a45-93f81af666b0", "title": "Railways. Roads and Bridges", "description": "Short Description" }, { "id": "26a383c2-98aa-4f7f-91b6-f4a75e0339ce", "title": "Engineering of construction materials and fittings", "description": "Short Description" }, { "id": "4b101413-aa8f-4f5f-9959-23339aef7fe5", "title": "Interior Design", "description": "Short Description" }, { "id": "8760bdef-b7f7-4cc1-ac84-c8a91cbc8950", "title": "Landscape architecture and green spaces", "description": "Short Description" }, { "id": "ada409e6-3ce1-4d5e-ae62-a613d90c8bb8", "title": "Architecture", "description": "Short Description" }, { "id": "b6730be1-d7e1-437a-ba06-9a84fb32771f", "title": "Engineering of gas supply and heating systems, ventilation", "description": "Short Description" }, { "id": "d704779a-5e81-4d5b-a3bd-b238d47483c9", "title": "Environmental engineering", "description": "Short Description" }, { "id": "f4fc434a-a48c-406b-9c69-869d8689c77f", "title": "Water Protection and Engineering", "description": "Short Description" }, { "id": "fb299e06-a677-42b7-bc48-57b3435fc9cb", "title": "Mechanical Engineering in Construction", "description": "Short Description" }, { "id": "fb42b61b-a0ff-41d2-9381-cabf0be50cbc", "title": "Sculpture", "description": "Short Description" }] }, { "id": "f3664286-15e9-49e5-b952-c02d744e09db", "title": "Faculty of Computers, Informatics and Microelectronics", "info": "Facultatea  de Calculatoare Informatică și Microelectronică dispune de întreaga bază materială necesară desfășurării proceselor didactice şi de cercetare științifică din cadrul programelor de studii, în concordanţă cu standardele care asigură desfășurarea unui proces de învăţământ de calitate. FCIM se axează pe acele activităţi care contribuie la dezvoltarea competenţelor sub formă de cunoştinţe şi abilităţi corespunzătoare, stimularea creativităţii şi inovării, inclusiv a spiritului antreprenorial, adaptarea la noile condiţii de pe piaţa muncii.", "specialties": [{ "id": "01e74a0f-c8e9-41df-bb27-ba120f291f42", "title": "Informational security", "description": "Short Description" }, { "id": "09b3e61e-25c3-422c-982c-539c2c6773c7", "title": "Automation and Information Science", "description": "Short Description" }, { "id": "1cab6f63-ec0d-4e70-87b6-dac3eac1b629", "title": "Biomedical systems engineering", "description": "Short Description" }, { "id": "568decdb-d948-4428-b04e-50c8b16c5094", "title": "Information technology", "description": "Short Description" }, { "id": "5e9c75f2-2130-41be-84c5-7a5674fa316b", "title": "Сomputers and Networks", "description": "Short Description" }, { "id": "69663ece-99f5-452f-aac0-52d59e78db7c", "title": "Software Engineering", "description": "Short Description" }, { "id": "ad04908f-c595-46aa-94e1-dc3256ca657a", "title": "Informational Management", "description": "Short Description" }, { "id": "b26b81df-2470-463c-afaa-e4abbb930663", "title": "Robotics and mechatronics", "description": "Short Description" }, { "id": "b6bbad5a-dc07-4349-b9ee-1f25a8eba815", "title": "Applied Informatics", "description": "Short Description" }, { "id": "c9943e33-7004-46d1-b778-ff4a7d48c8da", "title": "Microelectronics and nanotechnologies", "description": "Short Description" }] }, { "id": "f6aa4c0e-edc2-4bad-a22b-8516e3637546", "title": "Faculty of Energetics and Electrical Engineering", "info": "Facultatea Energetică și Inginerie Electrică este una dintre cele mai active facultăți din cadrul Universității Tehnice a Moldovei, cu peste 9000 de ingineri pregătiți până în prezent în domenii de importanţă naţională fără de care economia ţării nu se poate dezvolta. Misiunea FEIE este de a pregăti studenții la cel mai înalt nivel și de a-i ajuta să-și dezvolte potențialul pentru a-și urma pasiunea și a inova domeniile energetic şi electrotehnic.", "specialties": [{ "id": "08ef38ab-10ea-42a4-bdda-4baf96b01754", "title": "Thermoenergetics", "description": "Short Description" }, { "id": "564b50b4-b7a2-4c02-b6fb-9b9f7648a2d3", "title": "Electroenergetics", "description": "Short Description" }, { "id": "604f4c9b-8a04-4326-8c71-baea0a876ef4", "title": "Engineering and Quality Management", "description": "Short Description" }, { "id": "ae5c4955-3742-4617-b359-d8317a79575b", "title": "Engineering and management in Energetics", "description": "Short Description" }] }];

    this.faculties.forEach((faculty) => {
      this.tasks.push({
        name: faculty.title,
        checked: false,
        color: 'primary',
        subtasks: faculty.specialties?.map((specialty) => ({
          name: specialty.title,
          checked: false,
          color: 'accent'
        }))
      })
    });
  }

  getAllComplete(task) {
    return task.subtasks != null && task.subtasks.every(t => t.checked);
  }

  someComplete(task): boolean {
    if (task.subtasks == null) {
      return false;
    }

    return task.subtasks.filter(t => t.checked).length > 0;
  }

  setAll(checked: boolean, task) {
    if (task.subtasks == null) {
      return;
    }

    task.subtasks.forEach(t => (t.checked = checked));
  }

  public onSubmit(): void {
    // this.recommendationApiService.getCustomSpecialtyRecommendations(this.selectedHobbies).subscribe((recommendations) => {
    //   this.dialogRef.close();
    // });
  }
}
