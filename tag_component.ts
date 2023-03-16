import {Component, OnInit} from '@angular/core';
import {TagService} from "./tag.service";
import {Tag} from './tag';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {VCMessageService} from "../../../common/message/v-c-message.service";
import {ConfirmationService} from "primeng/api";

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    providers: [ConfirmationService]
})

export class TagComponent implements OnInit {
    tag: Tag | undefined;
    tagList: Tag[] = [];
    newTagFormGroup: FormGroup;

    constructor(public service: TagService, public vCMessageService: VCMessageService, private confirmationService: ConfirmationService) {
        this.newTagFormGroup = this.createFormGroup();
    }

    color: string = '#CBCBCB';
    colorPalette: Array<any> = ['#00BCD4', '#03A9F4', '#B2F35C', '#BE1616', '#162DBE', '#BE16BE', '#00FF17', '#00FFE8', '#E4E41A']

    ngOnInit(): void {

        this.service.getListOfTags()
            .toPromise()
            .then(tags => {
                this.tagList = tags;
            }).catch(res => {
            this.vCMessageService.showServerResponse(res, 'Sorry. Backend is not available at the moment.');
        });
    }

    createFormGroup(): FormGroup {
        return new FormGroup({
            color: new FormControl(null, Validators.required),
            name: new FormControl(null,
                [Validators.required, Validators.minLength(2), Validators.maxLength(32)]),
        });
    }

    addTag() {
        this.newTagFormGroup.markAllAsTouched();
        if (this.newTagFormGroup.valid) {
            let newTag = this.newTagFormGroup.value;
            if (this.tagList.find(tag => tag.name?.replace(/[^a-z0-9]/gi, '') === newTag.name?.replace(/[^a-z0-9]/gi, ''))) {
                this.vCMessageService.showError('Tag with this name already exists');
                return;
            }
            this.service.addTag(newTag).toPromise()
                .then(addedTag => {
                    let ref = document.getElementById('cancel')
                    ref?.click();
                    this.tagList.push(addedTag);
                })
                .catch((res) => {
                    console.log(res);
                    this.vCMessageService.showServerResponse(res,
                        res.error.parameters.fieldErrors[0].field + ' ' +
                        res.error.parameters.fieldErrors[0].message)
                });
        }
    }

    resetDefaultTag() {
        this.newTagFormGroup.reset({'name': '', 'color': '#CBCBCB'})
    }

    getAllTags() {
        this.service.getListOfTags().subscribe(res => {
            this.tagList = res;
        })
    }

    updateTag(uuid: any, editedTag: Tag) {
        let index = this.tagList.findIndex(e => e.uuid === uuid);
        this.service.updateTag(uuid, editedTag).toPromise()
            .then(res => {
                this.tagList[index] = res;
            })
            .catch(res => {
                this.vCMessageService.showServerResponse(res,
                    res.error.parameters.fieldErrors[0].field + ' ' +
                    res.error.parameters.fieldErrors[0].message)
            });
    }

    deleteTags(data: any) {
        this.confirmationService.confirm({
            message: "Are you sure that you want to proceed? ",
            accept: () => {
                this.service.deleteTag(data.uuid).subscribe(() => {
                    this.resetDefaultTag();
                    this.getAllTags()
                })
            }
        });
    }

    //https://github.com/primefaces/primeng/issues/10519 - Temp solution to fix the primeng inline edit function
    doNothing(e: any) {
        e.stopPropagation();
    }
}
