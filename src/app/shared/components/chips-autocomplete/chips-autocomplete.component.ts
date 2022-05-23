import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMMA, ENTER, TAB } from 'src/app/core/constants/key-codes.constant';
import { Hobby } from '../../models/hobby.model';

@Component({
  selector: 'app-chips-autocomplete',
  templateUrl: './chips-autocomplete.component.html',
  styleUrls: ['./chips-autocomplete.component.scss'],
  providers: [
    {       
      provide: NG_VALUE_ACCESSOR, 
      useExisting: forwardRef(() => ChipsAutocompleteComponent),
      multi: true     
    }  
  ]
})
export class ChipsAutocompleteComponent implements ControlValueAccessor, OnInit {
  @ViewChild('hobbyInput')
  public hobbyInput: ElementRef<HTMLInputElement>;

  @Input()
  public formGroup: FormGroup;

  @Input()
  public formControlName: string;

  @Input()
  public enableCustomChip = false;

  public separatorKeysCodes: number[] = [COMMA, TAB, ENTER];
  public filteredHobbies: Observable<string[]>;
  public hobbies: Hobby[] = [];
  public selectedHobbies: string[] = [];
  public existingHobbies: string[] = [];
  public val: string[] = [""]; 

  public set value(val: string[]) {
    this.val = val;
    
    this.selectedHobbies = this.val;

    this.onChange(val)
    this.onTouch(val)
  }

  public onChange: any = () => {}
  public onTouch: any = () => {}

  public chipsForm: FormGroup;
  
  constructor() { }

  public ngOnInit(): void {
    this.hobbies = [{ "hobbyId": 1, "title": "Art" }, { "hobbyId": 2, "title": "Math" }, { "hobbyId": 3, "title": "Urban Planning" }, { "hobbyId": 4, "title": "Science" }, { "hobbyId": 5, "title": "Music" }, { "hobbyId": 6, "title": "Algebra" }, { "hobbyId": 7, "title": "Geometry" }, { "hobbyId": 8, "title": "Programming" }, { "hobbyId": 9, "title": "Robotics" }, { "hobbyId": 10, "title": "Sport" }, { "hobbyId": 11, "title": "Biotechnology" }, { "hobbyId": 12, "title": "Energetics" }, { "hobbyId": 13, "title": "Software" }, { "hobbyId": 14, "title": "Architecture" }, { "hobbyId": 15, "title": "Mechanics" }, { "hobbyId": 16, "title": "Management" }, { "hobbyId": 17, "title": "Economy" }, { "hobbyId": 18, "title": "Textile" }, { "hobbyId": 19, "title": "Clothing" }, { "hobbyId": 20, "title": "Machines" }, { "hobbyId": 21, "title": "Sewing" }, { "hobbyId": 22, "title": "Cooking" }, { "hobbyId": 23, "title": "Baking" }, { "hobbyId": 24, "title": "Driving" }, { "hobbyId": 25, "title": "Engineering" }, { "hobbyId": 26, "title": "Transport" }, { "hobbyId": 27, "title": "Communication" }, { "hobbyId": 28, "title": "Radio" }, { "hobbyId": 29, "title": "Computers" }, { "hobbyId": 30, "title": "Biomedicine" }, { "hobbyId": 31, "title": "Chemistry" }, { "hobbyId": 32, "title": "Design" }, { "hobbyId": 33, "title": "Right" }, { "hobbyId": 34, "title": "Law" }, { "hobbyId": 35, "title": "Construction" }, { "hobbyId": 36, "title": "Woodworking" }, { "hobbyId": 37, "title": "Politics" }, { "hobbyId": 38, "title": "Society" }, { "hobbyId": 39, "title": "Citizenship" }, { "hobbyId": 40, "title": "Geography" }, { "hobbyId": 41, "title": "Realty" }, { "hobbyId": 42, "title": "Accounting" }, { "hobbyId": 43, "title": "Marketing" }, { "hobbyId": 44, "title": "Business" }, { "hobbyId": 45, "title": "Administration" }, { "hobbyId": 46, "title": "Energy" }, { "hobbyId": 47, "title": "Industrial technologies" }, { "hobbyId": 48, "title": "Analytics" }, { "hobbyId": 49, "title": "Training" }, { "hobbyId": 50, "title": "Leadership" }];
    this.existingHobbies = this.hobbies.map((t)=>t.title);
    
    this.chipsForm = new FormGroup({
      hobbyInput: new FormControl('')
    });

    this.filteredHobbies = this.chipsForm.get('hobbyInput').valueChanges.pipe(
      map((hobby: string | null) => (hobby ? this._filter(hobby) : this.existingHobbies.slice())),
    );
  }
  
  public writeValue(value: any){ 
    this.value = value
  }

  public registerOnChange(fn: any){
    this.onChange = fn
  }

  public registerOnTouched(fn: any){
    this.onTouch = fn
  }

  public remove(hobby: string): void {
    const index = this.selectedHobbies.indexOf(hobby);

    if (index >= 0) {
      this.selectedHobbies.splice(index, 1);
    }
  }

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();

    if (!value ||
      !this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value))&& !this.enableCustomChip ||
      this.selectedHobbies.find(hobby => hobby.toLowerCase().includes(value))) {
      return;
    }

    const newValue = this.enableCustomChip ? `${value.slice(0,1).toUpperCase().concat(value.slice(1, value.length))}` : this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value));
    
    this.selectedHobbies.push(newValue);
    event.chipInput!.clear();
    this.formGroup.get(this.formControlName).setValue(this.selectedHobbies);
  }
  
  public selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue.toLowerCase();
    
    if (!value ||
      !this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value)) ||
      this.selectedHobbies.find(hobby => hobby.toLowerCase().includes(value))) {
      return;
    }

    this.selectedHobbies.push(this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value)));

    this.hobbyInput.nativeElement.value = '';
  }

  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.existingHobbies.filter(hobby => hobby.toLowerCase().includes(filterValue));
  }
}
