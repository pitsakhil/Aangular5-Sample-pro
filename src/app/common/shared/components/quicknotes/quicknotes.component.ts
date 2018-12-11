import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, HostListener, ElementRef, ViewChild } from '@angular/core';

import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/autoresize';
import { GridOptions } from 'ag-grid';
import { Subscription } from 'rxjs/Subscription';
import { QuicknoteService } from '../../services/quicknote.service';
import { QuicknoteActions } from '../../store/quicknote.actions';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { NotificationService } from '../../../../common/notification/services/notification.service';
import { SharedStorageService } from '../../../../core/services';
import { HistoryService } from '../../services/history.service';
import { HistoryActions, GlobalProfileActions } from '../../store';
import { MetadataService } from '../../services/metadata.service';
import { TranslateService } from '@ngx-translate/core';
import { skip, skipWhile } from 'rxjs/operators';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

declare var tinymce: any;
let that: any;
@Component({
    selector: 'app-quicknotes',
    templateUrl: './quicknotes.component.html',
    styleUrls: ['./quicknotes.component.scss'],
    providers: [DateFormatPipe, SafeHtmlPipe]
})

export class QuicknotesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() documentId: number;
    private _subscriptions = new Subscription();
    public shortNameRefList: object;
    private _oldEditorContent: string;
    private _tinymceId: string;
    public cellEditEnabled: boolean;
    public quickNoteGridOptions: GridOptions;
    public selectedRowId: number;
    public selectedRowIndex: number;
    public privateCount: number;
    public publicCount: number;
    public deleteTitle$: string;
    public saveTitle$: string;
    public editor: any;
    public collpaseHide = true;
    public accordinArrow$ = 'keyboard_arrow_right';
    public payload: object;
    public deleteIconEnable: boolean;
    public addIconEnable: boolean;
    public editIconEnable: boolean;
    public readPermission: boolean;
    public editPermission: boolean;
    public deletePermission: boolean;
    public addPermission: boolean;
    public privateIcon: boolean;
    public publicIcon: boolean;
    public quicknotePermission: number;
    public editorContent: any;
    public quickNoteType: number;
    public addNote: boolean;
    public hasChangedContent: boolean;
    public preventSave: boolean;
    public saveQuickNoteEnable: boolean;
    public editorHasContent: boolean;
    private _firstTimeCase = true;
    noteList: Array<any>;
    selectedRowData: any;

    @ViewChild('quicknoteBody') clickElementRef: ElementRef;
    languageUrl: any;

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        const isNavigateAway = !!this.saveQuickNoteEnable ? false : true;
        return isNavigateAway;
    }

    constructor(
        private _quicknoteService: QuicknoteService,
        private _quicknoteActions: QuicknoteActions,
        private _notificationService: NotificationService,
        private _globalProfileActions: GlobalProfileActions,
        private _sharedStorageService: SharedStorageService,
        private _historyService: HistoryService,
        private _historyActions: HistoryActions,
        private _metadataService: MetadataService,
        private _translate: TranslateService,
        private _dateFormatPipe: DateFormatPipe,
        private _SafeHtmlPipe: SafeHtmlPipe,
        private _idle: Idle
    ) {
        that = this;
        this.deleteTitle$ = 'quicknoteDeleteConfirm';
        this.saveTitle$ = 'quicknoteSaveConfirm';
    }

    ngOnInit() {
        this._setQuicknoteLoadPermission();
        this._init();
    }
    private _init(): void {
        this.cellEditEnabled = false;
        this.addIconEnable = true;
        this.editIconEnable = false;
        this.deleteIconEnable = false;
        this.editorHasContent = false;
        this.addNote = false;
        this.setLanguages();
        this._getQuicknotePermission(true);
        this._saveQuickNoteIfBrowserIsIdle(180);
    }

    ngOnChanges(changes) {
        this.publicCount = 0;
        this.privateCount = 0;
        this._onInputChange(changes);
    }

    private _onInputChange(changes): void {
        if (!changes) {
            return undefined;
        }
        if (changes && changes['documentId'] && !!this.documentId) {
            this._firstTimeCase = true;
            this._setQuicknoteLoadPermission();
            this.collpaseHide = true;
            this.accordinArrow$ = 'keyboard_arrow_right';
            this._getQuicknotePermission(true);
            this._quicknoteActions.fetchQuicknotes({ document_id: this.documentId });
            tinymce.remove(this.editor);
            this.deleteIconEnable = false;
        }
    }

    private setLanguages() {
        const lang = localStorage.getItem('lang');
        switch (lang) {
            case 'en_US': this.languageUrl = ''; break;
            case 'en_GB': this.languageUrl = './assets/public/js/en_GB.js'; break;
            case 'de_DE': this.languageUrl = './assets/public/js/de.js'; break;
            case 'de_CH': this.languageUrl = './assets/public/js/de.js'; break;
            case 'de_AT': this.languageUrl = './assets/public/js/de_AT.js'; break;
        }
    }


    private _fixedTinyMceInit(): any {
        const lang_url = this.languageUrl;
        tinymce.init({
            selector: 'textarea#tinyMCENote',
            init_instance_callback: editor => { editor.focus(); },
            autoresize_bottom_margin: 0,
            autoresize_min_height: 75,
            paste_text_sticky: true,
            paste_data_images: true,
            content_css: './assets/public/css/tintmcedefault.css',
            max_chars: 10000, // max. allowed chars
            menubar: false,
            setup: editor => this._editorSetUp(editor),
            branding: false,
            document_base_url: '/',
            language_url: lang_url,
            skin_url: './assets/public/skins/lightgray',
            plugins: ['textcolor paste autoresize'],
            toolbar: `forecolor bold italic underline strikethrough`,
        });
    }
    private _dynamicTinyMceInit(): any {
        const lang_url = this.languageUrl;
        tinymce.init({
            // selector: '.ag-large-textarea textarea',
            selector: '.selectedRow',
            autoresize_bottom_margin: 0,
            autoresize_min_height: 75,
            paste_text_sticky: true,
            paste_data_images: true,
            content_css: './assets/public/css/tintmcedefault.css',
            max_chars: 10000, // max. allowed chars
            menubar: false,
            setup: editor => this._editorSetUp(editor),
            branding: false,
            document_base_url: '/',
            language_url: lang_url,
            skin_url: './assets/public/skins/lightgray',
            plugins: ['textcolor paste autoresize'],
            toolbar: `forecolor bold italic underline strikethrough`
        });
    }

    private _editorSetUp(editor): void {
        const id = editor.id;
        that._tinymceId = id;
        this.editor = editor;
        editor.on('init', () => {
            editor.selection.select(editor.getBody(), true);
            editor.selection.collapse(false);
            tinymce.get(tinymce.activeEditor.id).contentDocument.body.focus();
        });

        editor.on('keydown', function (e) {
            const allowedKeys = [8, 37, 38, 39, 40, 46]; // backspace, delete and cursor keys
            if (allowedKeys.indexOf(e.keyCode) !== -1) {
                return true;
            }
            that._checkChangesOnEvent();
            if (that._getContentLength() + 1 > this.settings.max_chars) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            return true;
        });

        editor.on('keyup change click mouseout', () => {
            that._checkChangesOnEvent();
        });


        editor.on('blur', function (e) {
            that.preventSave = false;
            that._updateChangesOnEvent();
        });


        editor.on('paste', function (e) {
            let newVal = ''; let delay;
            clearTimeout(delay);
            delay = setTimeout(() => {
                if (that._getContentLength() > this.settings.max_chars) {
                    const newContent = editor.getContent();
                    const tmp = document.createElement('div');
                    tmp.innerHTML = newContent;
                    newVal = tmp.textContent || tmp.innerText;
                    editor.setContent(newVal.substring(0, 10000));
                    that._checkChangesOnEvent();
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                return true;
            }, 300);
        });

        editor.on('ExecCommand', (e) => {
            if (e.ui === 'forecolor') {
                this.preventSave = true;
                editor.selection.collapse(false);
                editor.focus();
                that._checkChangesOnEvent();
            }
        });
    }

    removeClass(className) {
        const selectedRows = document.querySelectorAll('.' + className);
        Array.prototype.map.call(selectedRows, (value, index) => {
            selectedRows[index].classList.remove(className);
        });
    }


    setTinymceRow(id, row) {
        this.selectedRowIndex = id;
        this.selectedRowData = row;
        this.selectedRowId = row.id;
        this.removeClass('selectedRow');
        this.removeClass('no-row');
        this.removeClass('selectedParentRow');
        const mainElement = document.getElementById('row-' + id);
        mainElement.classList.add('selectedRow');
        const parentElement = document.getElementById('container-row-' + id);
        parentElement.classList.add('selectedParentRow');
        tinymce.remove(this.editor);
        if (row.type_id === 1) {
            this._setPermission();
        } else {
            this.editIconEnable = true;
            this.deleteIconEnable = true;
        }
        if (this.cellEditEnabled) {
            this.editIconEnable = false;
            this.deleteIconEnable = false;
        }
    }

    onTap(event) {
        if (event.tapCount === 2) {
            this.toggleView(this.selectedRowIndex, this.selectedRowData);
        }
    }

    toggleView(id, row) {
        const innerElement = document.getElementById('inner-row-' + id);
        innerElement.classList.add('no-row');
        this.addNote = false;
        this.addIconEnable = false;
        this.deleteIconEnable = false;
        tinymce.remove(this.editor);
        that._dynamicTinyMceInit();
        this.cellEditEnabled = true;
        that._oldEditorContent = row.description;
    }

    /**
    * Function to get Content Length of active tinymce editor.
    *
    * @author David Raja <david.ra@pitsolutions.com>
    *
    */
    private _getContentLength(): number {
        return tinymce.get(tinymce.activeEditor.id).contentDocument.body.innerText.length;
    }
    /**
    * Function to check changes in tinymce editor.
    *
    * @author David Raja <david.ra@pitsolutions.com>
    *
    */
    private _checkChangesOnEvent(): void {
        this.editorContent = this.editor.getContent();
        let regx = this.editorContent.replace(new RegExp('<p>(\\s|&nbsp;)*<\\/p>', 'gi'), '');
        regx = regx.replace(/\n/g, '');
        this.editorHasContent = (!!this.editorContent && this.editorContent !== '' && regx !== '') ? true : false;
        (!!that._oldEditorContent && that._oldEditorContent !== '') && that._oldEditorContent === this.editorContent ? this.hasChangedContent = false : this.hasChangedContent = true;
        switch (this.addNote) {
            case false:
                this.saveQuickNoteEnable = (this.editorHasContent && this.hasChangedContent) ? true : false;
                break;
            case true:
                this.saveQuickNoteEnable = (this.editorHasContent) ? true : false;
                break;
        }
    }
    /**
    * Function to update changes in tinymce editor.
    *
    * @author David Raja <david.ra@pitsolutions.com>
    *
    */
    private _updateChangesOnEvent(): void {
        let delay;
        clearTimeout(delay);
        if (this.addNote) {
            delay = setTimeout(() => {
                if (!this.preventSave) {
                    if (this.editorHasContent === true) {
                        this.saveQuickNote();
                    } else {
                        this.addNote = false; this.addIconEnable = true; this.cellEditEnabled = false; this.editIconEnable = false; tinymce.remove(this.editor);
                    }
                }
            }, 600);
        } else {
            delay = setTimeout(() => {
                // tslint:disable-next-line:no-unused-expression
                if (!this.preventSave && this.saveQuickNoteEnable) {
                    this.saveQuickNote();
                } else if (!this.saveQuickNoteEnable && this.hasChangedContent === false) {
                    this.removeClass('no-row');
                    tinymce.remove(this.editor);
                    this.cellEditingStopped(this.selectedRowData);
                }
            }, 600);
        }
    }

    /**
      * Function to get permission of quicknotes.
      *
      * @author David Raja <david.ra@pitsolutions.com>
      *
      */
    private _getQuicknotePermission(callFetchData = false): void {
        this._historyService.currentPayload.subscribe(payload => this.payload = payload);
        this._subscriptions.add(this._metadataService.getUserPermissionDetails().pipe(skipWhile(x => !!x && !Object.keys(x).length)).subscribe((res) => {
            this.readPermission = res[1];
            this.editPermission = res[2];
            this.deletePermission = res[3];
            this.addPermission = res[4];
            if (callFetchData) {
                that._getQuickNotes();
            }
        }));
    }
    /**
      * Function to set permission of quicknotes.
      *
      * @author David Raja <david.ra@pitsolutions.com>
      *
      */
    private _setQuicknoteLoadPermission(): void {
        this._globalProfileActions.fetchGlobalProfileData(this.documentId);
        this._quicknoteService.getGlobalProfile().pipe(skip(1)).subscribe((res) => {
            this.quicknotePermission = res['userdata'].is_default_private;
            if (this.quicknotePermission === 0) {
                this.publicIcon = true;
                this.privateIcon = true;
            } else if (this.quicknotePermission === 1) {
                this.publicIcon = false;
                this.privateIcon = true;
            }
        }
        );
    }

    /**
   * Function to fetch column data of quicknotes.
   *
   * @author David Raja <david.ra@pitsolutions.com>
   *
   */
    private _fetchTableData(): void {
        this._subscriptions.add(
            this._quicknoteService
                .getQuicknotesList()
                .pipe(skip(1))
                .subscribe({
                    next: (res) => {
                        const data = res['quicknotesList'];
                        let publicCount = 0; let privateCount = 0;
                        const filterByPublicID = (item) => {
                            if (item.type_id && item.type_id === 1) {
                                publicCount++;
                                return true;
                            }
                            return false;
                        };
                        const filterByPrivateID = (item) => {
                            if (item.type_id && item.type_id === 2) {
                                privateCount++;
                                return true;
                            }
                            return false;
                        };
                        if (data['list'].length > 0) {
                            if (!!data['reference']['short_name']) {
                                this.shortNameRefList = data['reference']['short_name'];
                            }
                            const publicArray = data['list'].filter(filterByPublicID);
                            const privateArray = data['list'].filter(filterByPrivateID);
                            if (this.publicIcon === true && this.privateIcon === true && !this._firstTimeCase) {
                                this.noteList = data['list'];
                            } else if (this.publicIcon === true && this.privateIcon === false && !this._firstTimeCase) {
                                this.noteList = publicArray;
                            } else if (this.publicIcon === false && this.privateIcon === true && !this._firstTimeCase) {
                                this.noteList = privateArray;
                            } else {
                                this.noteList = [];
                                this.addNote = false;
                                this.addIconEnable = true;
                                tinymce.remove(this.editor);
                            }
                        } else {
                            this.noteList = [];
                        }
                        this.publicCount = publicCount;
                        this.privateCount = privateCount;
                    }, error: (err) => { }
                }));
    }
    /**
     * Function to fetchQuicknotes after save.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     */
    private _getQuickNotes(): void {
        this._quicknoteActions.fetchQuicknotes({ document_id: this.documentId });
        this._historyActions.fetchHistoryData(this.payload);
        this._fetchTableData();
    }
    /**
     * Function to enable/disable Edit/Delete icons.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     */
    private _setPermission(): void {
        this.editIconEnable = (this.editPermission === true || this.addPermission === true) ? true : false;
        this.deleteIconEnable = (this.deletePermission === true) ? true : false;
    }

    /**
     * Function to check changes present in editor.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param saveButton
     */
    public checkChanges(saveButton: HTMLElement): void {
        const editorContent = this.editor.getContent();
        let regx = editorContent.replace(new RegExp('<p>(\\s|&nbsp;)*<\\/p>', 'gi'), '');
        regx = regx.replace(/\n/g, '');
        if (!this.addNote) {
            if (!!that._oldEditorContent && that._oldEditorContent !== '') {
                if (that._oldEditorContent === editorContent) {
                    this.cellEditEnabled = false;
                    this.cellEditingStopped(this.selectedRowData);
                    this.removeClass('no-row');
                } else {
                    if (editorContent !== '' && regx !== '') {
                        this.preventSave = true;
                        saveButton.click();
                    } else {
                        // tslint:disable-next-line:no-unused-expression
                        editorContent === '' && saveButton.click();
                    }
                }
            } else {
                if (!!editorContent && editorContent === '') {
                    this.cellEditingStopped(this.selectedRowData);
                }
            }
        } else {
            if (editorContent !== '' && regx !== '') {
                this.preventSave = true;
                saveButton.click();
            } else {
                this.addIconEnable = true;
                this.addNote = false;
                tinymce.remove(this.editor);
                this.cellEditEnabled = false;
            }
        }
    }
    /**
     * Function to confirm save of unsaved editor.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param saveButton
     */
    public confirmSave(value: boolean): void {
        if (value) {
            this.saveQuickNoteEnable = false;
            if (!!that._oldEditorContent && that._oldEditorContent !== '') {
                this.editor.setContent(that._oldEditorContent);
            }
            this.hasChangedContent = false;
            if (this.addNote) {
                this.addNote = false;
            }
            tinymce.remove(this.editor);
            this.addIconEnable = true;
            this.cellEditEnabled = false;
        } else { }
    }


    /**
     * Function to apply public/ private filters.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param icon
     */
    public toggleIcon(icon: string): void {
        switch (icon) {
            case 'public': this.publicIcon = (this.publicIcon === true) ? false : true;
                this._getQuickNotes();
                break;
            case 'private': this.privateIcon = (this.privateIcon === true) ? false : true;
                this._getQuickNotes();
                break;
        }
    }

    /**
     * Function to create a new quicknote.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param id
     */
    public createQuickNote(id: number): void {
        this.addNote = true;
        this.deleteIconEnable = false;
        this.quickNoteType = id;
        that._oldEditorContent = '';
        this._fixedTinyMceInit();
        this.editor.setContent('');
        this.selectedRowId = null;
        let delay;
        clearTimeout(delay);
        delay = setTimeout(() => {
            tinymce.get(tinymce.activeEditor.id).contentDocument.body.click();
            this.addIconEnable = false;
            this.cellEditEnabled = true;
            this.editIconEnable = false;
        }, 50);
    }
    /**
   * Function to enable cell in edit mode.
   *
   * @author David Raja <david.ra@pitsolutions.com>
   *
   */
    public enableCellEditing(): void {
        this.deleteIconEnable = false;
        this.toggleView(this.selectedRowIndex, this.selectedRowData);
    }

    public cellEditingStopped(row): void {
        that.addIconEnable = true;
        that.cellEditEnabled = false;
        this.saveQuickNoteEnable = false;
        tinymce.remove(this.editor);
        if (row.type_id === 1) {
            that._setPermission();
        } else {
            this.editIconEnable = true;
            this.deleteIconEnable = true;
        }
    }

    public clearEditing() {
        const element = document.getElementById('scrollable');
        element.scrollTop = 0;
        that._oldEditorContent = '';
        this.addIconEnable = true;
        this.deleteIconEnable = false;
        this.editIconEnable = false;
        this.cellEditEnabled = false;
    }
    /**
     * Function to save/update a quicknotes on save button click.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     */
    public saveQuickNote(): void {
        this.saveQuickNoteEnable = false;
        let regx = this.editorContent.replace(new RegExp('<p>(\\s|&nbsp;)*<\\/p>', 'gi'), '');
        regx = regx.replace(/\n/g, '');
        if (this.addNote) {
            if (regx !== '') {
                this.addNote = false;
                this._addQuickNote();
            }
        } else {
            if (this.selectedRowId === null) {
                return;
            }

            const currentContent = this.editorContent;
            if (!!that._oldEditorContent) {
                if (that._oldEditorContent === currentContent) {
                    return;
                }
            }
            if (currentContent === '' && regx === '') {
                if (!!that._oldEditorContent && that._oldEditorContent !== '') {
                    this.editor.setContent(that._oldEditorContent);
                    tinymce.remove(this.editor);
                    // document.body.click();
                    // document.documentElement.click();
                    return;
                } else {
                    return;
                }
            }
            this._updateQuickNote(currentContent);
        }
    }
    /**
   * Function to add a new quicknote to store.
   *
   * @author David Raja <david.ra@pitsolutions.com>
   *
   */
    private _addQuickNote(): void {
        const currentContent = this.editor.getContent();
        if (currentContent === '') {
            return;
        }
        const body_params = {
            type_id: this.quickNoteType,
            content: currentContent
        };
        this._quicknoteActions.addQuicknote({ document_id: this.documentId, body: JSON.stringify(body_params) });
        this.cellEditingStopped(currentContent);
        this._subscriptions.add(
            this._quicknoteService.addQuicknote().pipe(skip(1)).subscribe({
                next: (res) => {
                    tinymce.remove(this.editor);
                    this._getQuickNotes();
                    this.quickNoteType = null;
                    this.clearEditing();
                    this._notificationService.success('success', res['quicknote'].message);
                }, error: (err) => {
                    this._notificationService.error('error', err['quicknote'].message);
                }
            }));
    }
    /**
   * Function to update existing quicknote to store.
   *
   * @author David Raja <david.ra@pitsolutions.com>
   *
   */
    private _updateQuickNote(noteContent: string): void {
        const id = this.selectedRowId;
        const body_params = {
            content: noteContent
        };
        this._quicknoteActions.saveQuicknote({ document_id: this.documentId, quicknote_id: id, body: JSON.stringify(body_params) });
        this.cellEditingStopped(this.selectedRowData);
        this.selectedRowId = null;
        this._subscriptions.add(
            this._quicknoteService.saveQuicknote().pipe(skip(1)).subscribe({
                next: (res) => {
                    this.clearEditing();
                    tinymce.remove(this.editor);
                    this._getQuickNotes();
                    this._notificationService.success('success', res['quicknote'].message);
                }, error: (err) => {
                    this._notificationService.error('error', err['quicknote'].message);
                }
            }));
    }
    /**
     * Function to delete the selected quicknote.
     *
     * @author David Raja <david.ra@pitsolutions.com>
     *
     * @param note
     */
    public deleteQuickNote(value: boolean): void {
        if (value) {
            this._quicknoteActions.deleteQuicknote({ document_id: this.documentId, quicknote_id: this.selectedRowId });
            this._subscriptions.add(
                this._quicknoteService.deleteQuicknote().pipe(skip(1)).subscribe({
                    next: (res) => {
                        this.clearEditing();
                        this._getQuickNotes();
                        this._notificationService.success('success', res['quicknote'].message);
                    }, error: (err) => {
                        this._notificationService.error('error', err['quicknote'].message);
                    }
                }));
        }
    }

    public collpase(event: any): void {
        if (!event) {
            return undefined;
        }
        const iconcollpase = event.target.innerHTML;
        if (this.collpaseHide === true && iconcollpase === 'keyboard_arrow_right') {
            this.collpaseHide = false;
            this.accordinArrow$ = 'keyboard_arrow_down';
            if (this._firstTimeCase) {
                this._getQuickNotes();
                this._firstTimeCase = false;
            }
        } else {
            this.collpaseHide = true;
            this.accordinArrow$ = 'keyboard_arrow_right';
        }
    }

    /**
     * Function to save the quick note if browser is idle for 3 minutes
     * @param time 
     * 
     * @author Vijayan PP<vijayan.pp@pitsolutions.com>
     */
    private _saveQuickNoteIfBrowserIsIdle(time: number): void {
        if (!time) {
            return undefined;
        }
        this._idle.setIdle(1);
        this._idle.setTimeout(time);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this._idle.onTimeout.subscribe(() => {
            // tslint:disable-next-line:no-unused-expression
            (this.saveQuickNoteEnable) && this.saveQuickNote();
        });

        this.reset();

    }

    /**
    * Function to reset the Browser idle time
    * @author Vishnu C A <vishnu.ca@pitsolutions.com>
    */
    reset() {
        this._idle.watch();
    }


    /**
    * Function to unsubscrbe all subscriptions and save the quick notes when the component is destroyed
    * 
    * @author Vijayan PP<vijayan.pp@pitsolutions.com>
   */
    private _onDestroy(): void {
        // tslint:disable-next-line:no-unused-expression
        (this.saveQuickNoteEnable) && this.saveQuickNote();
        this._subscriptions.unsubscribe();
    }

    ngOnDestroy() {
        this._onDestroy();
    }

}
