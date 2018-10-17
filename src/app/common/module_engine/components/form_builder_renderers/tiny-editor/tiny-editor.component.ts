import { Component, AfterViewChecked, EventEmitter, OnDestroy, Input, Output, OnInit } from '@angular/core';

import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/media';
import 'tinymce/plugins/image';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/charmap';
import { Field } from '../../../models/field.interface';
import { FieldConfig } from '../../../models/field-config.interface';
import { FormGroup } from '@angular/forms';

declare var tinymce: any;

@Component({
    selector: 'app-tiny-editor',
    templateUrl: './tiny-editor.component.html',
    styleUrls: ['./tiny-editor.component.scss']
})

export class TinyEditorComponent implements OnDestroy, OnInit, AfterViewChecked, Field {

    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEditorContentChange = new EventEmitter();
    public config: FieldConfig;
    public group: FormGroup;
    private editor: any;
    public copy: FieldConfig;
    public formindex: number;
    public lang_url: string;

    constructor() { }

    ngOnInit() {
        this._setTinyMCElocale();
    }

    ngAfterViewChecked() {
        this.tinyMceInit();
    }

    /**
    * function to get current module from local storage
    *
    * @author Vishnu BK<vishnu.bk@pitsolutions.com>
    */
    getCurrentModule() {
        return localStorage.getItem('currentModule');
    }

    private _setTinyMCElocale(): void {
        const lang_url = localStorage.getItem('lang');
        switch (lang_url) {
            case 'en_US': this.lang_url = ''; break;
            case 'en_GB': this.lang_url = './assets/public/js/en_GB.js'; break;
            case 'de_DE': this.lang_url = './assets/public/js/de.js'; break;
            case 'de_CH': this.lang_url = './assets/public/js/de.js'; break;
            case 'de_AT': this.lang_url = './assets/public/js/de_AT.js'; break;
            default: this.lang_url = ''; break;
        }
    }

    private tinyMceInit(): void {
        const lang_url = this.lang_url;
        tinymce.init({
            selector: 'textarea#tinyMCE',
            allow_html_in_named_anchor: true,
            // init_instance_callback: function (editor) { editor.focus(); },//useed to add focus on page load
            height: 200,
            menubar: false,
            setup: editor => this.editorSetUp(editor),
            branding: false,
            document_base_url: '/',
            language_url: lang_url,
            skin_url: './assets/public/skins/lightgray',
            plugins: ['link textcolor lists advlist media image anchor insertdatetime charmap'],
            // tslint:disable-next-line:max-line-length
            toolbar: `formatselect | undo redo | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | insert | help`
        });
    }

    private editorSetUp(editor): void {
        this.editor = editor;
        editor.on('keyup change', () => {
            const content = editor.getContent();
            const controls = {};
            controls[this.config['field_name']] = content;
            this.group.patchValue(controls);
            this.onEditorContentChange.emit(content);
        });

        editor.on('click', () => {
            const body = document.querySelector('body'); // to fix the ng-select closing issue            
            body.click();
        });
    }

    private _manageCloning() {
        this.copy = JSON.parse(JSON.stringify(this.config));
        const cloneTitle = localStorage.getItem('cloning');
        if (cloneTitle) {
            const copy = JSON.parse(JSON.stringify(this.config));
            copy['field_title'] = cloneTitle;
            copy['field_value'] = '';

            this.config = copy;

        }
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }

}
