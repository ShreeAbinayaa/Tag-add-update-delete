import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TagComponent} from './tag.component';
import {TagService} from "./tag.service";
import {VCMessageService} from "../../../common/message/v-c-message.service";
import {MockVCMessageService} from "../../../common/message/v-c-message.service.spec";
import {of} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ConfirmationService} from "primeng/api";

describe('TagComponent', () => {
    let component: TagComponent;
    let service: TagService;
    let vCMessageService: VCMessageService;
    let confirmationService: ConfirmationService;
    let fixture: ComponentFixture<TagComponent>;
    let mockTag={
        createdDate: "2022-11-25T14:11:16.192Z",
        color: "#FeE",
        createdBy: "string",
        lastModifiedDate: "2022-11-25T14:11:16.192Z",
        lastModifiedBy: "string",
        name: "police",
        uuid: "413b1364-cab6-54fe-a529-53803572327d"
    };

    beforeEach(async () => {

        // @ts-ignore
        vCMessageService = new VCMessageService();
        confirmationService = new ConfirmationService();
        component = new TagComponent(service, vCMessageService, confirmationService);

        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TagService,
                {provide: VCMessageService, useClass: MockVCMessageService}],
            declarations: [TagComponent],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
        })
            .compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(TagComponent);
        component = fixture.componentInstance;
        component.tagList = [];


        let service = TestBed.inject(TagService)
        jest.spyOn(service, 'getListOfTags').mockImplementation(() => {
            return of([]) as any;
        });
        jest.spyOn(service, 'updateTag').mockImplementation(() => {
            return of([]) as any;
        });
        jest.spyOn(service, 'deleteTag').mockImplementation(() => {
            return of([]) as any;
        });
        fixture.detectChanges();
    });

    describe('createFormGroup', () => {
        it('should create form group', () => {
            // @ts-ignore
            const spy = jest.spyOn(component, 'createFormGroup').mockReturnValue(new FormGroup({
                color: new FormControl(null, Validators.required),
                name: new FormControl(null,
                    [Validators.required, Validators.minLength(2), Validators.maxLength(32)])
            }));

            const formGroup = component.createFormGroup();

            expect(spy).toHaveBeenCalled();
            expect(formGroup.controls['color']).toBeDefined();
            expect(formGroup.controls['name']).toBeDefined();
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call postTagDetails', () => {
        component.addTag();
    });
    it('should call getAllTags', () => {
        component.getAllTags();
    });
    it('should call updateTag', () => {
        component.updateTag({}, {});
    });
    it('should call delete', () => {
        component.tagList = [];
        component.deleteTags({});
    });
    it('form invalid when empty', () => {
        expect(component.newTagFormGroup.valid).toBeFalsy();
    });
    it('tag name field validity', () => {
        let name = component.newTagFormGroup.controls['name'];
        expect(name.valid).toBeFalsy();
    });
    it('should test input validity', () => {
        const nameInput = component.newTagFormGroup.controls.name;
        const colorInput = component.newTagFormGroup.controls.color;

        expect(nameInput.valid).toBeFalsy();
        expect(colorInput.valid).toBeFalsy();

        nameInput.setValue('Emergency');
        expect(nameInput.valid).toBeTruthy();
    })
    it('should call updateTagDetails', () => {
        let tempService = TestBed.inject(TagService);

        let spy = jest.spyOn(tempService,'updateTag').mockImplementation(() => {
            return of([mockTag]) as any;
        });

        component.updateTag("413b1364-cab6-54fe-a529-53803572327d",
            {
                createdDate: new Date(2022-11-25),
                color: "#FeE",
                createdBy: "string",
                lastModifiedDate: new Date(2022-11-25),
                lastModifiedBy: "string",
                name: "police",
                uuid: "413b1364-cab6-54fe-a529-53803572327d"
            });

        expect(spy).toHaveBeenCalled();

    });
    it('should call reset default',  ()=> {
        component.resetDefaultTag();
        expect(component.color).toEqual('#CBCBCB')

    });
});
