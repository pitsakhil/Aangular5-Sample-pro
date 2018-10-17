// tslint:disable-next-line:max-line-length
import { Component, OnInit, NgModule, SimpleChanges, OnChanges, ChangeDetectorRef, AfterViewChecked, ContentChild, ViewChild, forwardRef, Input, Output, EventEmitter, ElementRef, AfterViewInit, DoCheck } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyException } from './ca-select.model';
import { DropdownSettings } from './ca-select.interface';
import { ClickOutsideDirective, ScrollDirective, styleDirective, setPosition } from './clickOutside';
import { ListFilterPipe } from './list-filter';
import { Item, Badge, Search, TemplateRenderer } from './menu-item';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ScaylaSelectComponent),
    multi: true
};
export const DROPDOWN_CONTROL_VALIDATION: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ScaylaSelectComponent),
    multi: true,
}

export function openDropDown(id: string): any {
    triggerById.next(id);
}

let triggerById = new BehaviorSubject<string>('');

const noop = () => {
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'scayla-select',
    templateUrl: './ca-select.component.html',
    styleUrls: ['./ca-select.component.scss'],
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION],
})

// tslint:disable-next-line:max-line-length
export class ScaylaSelectComponent implements OnInit, DoCheck, ControlValueAccessor, OnChanges, Validator, AfterViewChecked, AfterViewInit {

    @Input()
    data: Array<any>;

    @Input()
    settings: DropdownSettings;

    @Input()
    text: string;

    @Input('formControlValue') form: FormControl;

    @Input() id: string;

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSelect')
    onSelect: EventEmitter<any> = new EventEmitter<any>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onDeSelect')
    onDeSelect: EventEmitter<any> = new EventEmitter<any>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSelectAll')
    onSelectAll: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onDeSelectAll')
    onDeSelectAll: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onOpen')
    onOpen: EventEmitter<any> = new EventEmitter<any>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output('onClose')
    onClose: EventEmitter<any> = new EventEmitter<any>();

    @ContentChild(Item) itemTempl: Item;
    @ContentChild(Badge) badgeTempl: Badge;
    @ContentChild(Search) searchTempl: Search;


    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('selectedList') selectedListElem: ElementRef;

    public selectedItems: Array<any>;
    public selectedItemsNotListed: Array<any>;
    public isActive = false;
    public isSelectAll = false;
    public groupedData: Array<any>;
    filter: any;
    public chunkArray: any[];
    public scrollTop: any;
    public chunkIndex: any[] = [];
    public cachedItems: any[] = [];
    public totalRows: any;
    public itemHeight: any = 41.6;
    public screenItemsLen: any;
    public cachedItemsLen: any;
    public totalHeight: any;
    public scroller: any;
    public maxBuffer: any;
    public lastScrolled: any;
    public lastRepaintY: any;
    public selectedListHeight: any;
    public showSelect = false;
    public selectType: string;
    public listdata: any;
    private currentValue: any;

    defaultSettings: DropdownSettings = {
        singleSelection: false,
        text: 'None',
        enableCheckAll: false,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: '',
        showCheckbox: false,
        noDataLabel: 'Click Tab / Enter to add',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'itemName',
        primaryKey: 'id',
        position: 'bottom',
        selectType: 'tag',
        clearEnabled: true,
        empty: '',
    }
    public parseError: boolean;
    constructor(public _elementRef: ElementRef, private cdr: ChangeDetectorRef) {

    }

    ngOnInit() {
        // tslint:disable-next-line:no-unused-expression
        this._init();
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to initialize all essential configurations.
     */
    private _init() {
        this.listdata = this.data;
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.groupBy) {
            this.groupedData = this.transformData(this.data, this.settings.groupBy);
        }
        this.totalRows = (this.data && this.data.length);
        this.cachedItems = this.data;
        this.screenItemsLen = Math.ceil(this.settings.maxHeight / this.itemHeight);
        this.cachedItemsLen = this.screenItemsLen * 3;
        this.totalHeight = this.itemHeight * this.totalRows;
        this.maxBuffer = this.screenItemsLen * this.itemHeight;
        this.lastScrolled = 0;
        this.selectedItemsNotListed = Object([]);
        this.renderChunk(0, this.cachedItemsLen / 2);
        if (this.settings.position == 'top') {
            setTimeout(() => {
                this.selectedListHeight = { val: 0 };
                this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            });
        }

        triggerById.subscribe(res => {
            this._onTriggerDropDown(res);
        });
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Angular Onchange life cycle hook - on every changes in data is handled here
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.firstChange) {
            this.listdata = this.data;
            this.cachedItems = this.data;
            this.writeValue(this.currentValue);
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length == 0) {
                    this.selectedItems = [];
                }
            }
        }
        if (changes.settings && !changes.settings.firstChange) {
            this.settings = Object.assign(this.defaultSettings, this.settings);
        }
        if (changes.form) {
            this.writeValue(this.form);
        }

        if (changes.text && !changes.text.firstChange) {
            this.settings.text = this.text;
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Angular lifecycle hook to detect changes - check value is selected
     */
    ngDoCheck() {
        if (this.selectedItems && this.data) {
            if (this.selectedItems.length === 0 || this.data.length == 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Angular lifecycle hook to load after view loaded
     */
    ngAfterViewInit() {
        if (this.settings.lazyLoading) {
            this._elementRef.nativeElement.getElementsByClassName('lazyContainer')[0].addEventListener('scroll', this.onScroll.bind(this));
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to adjust height and position after view is loaded
     */
    ngAfterViewChecked() {
        if (this.selectedListElem.nativeElement.clientHeight && this.settings.position == 'top' && this.selectedListHeight) {
            this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            this.cdr.detectChanges();
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to trigger when a item is selected.
     * @param item: selected item from dropdown
     */
    public onItemClick(item: any) {
        if (this.settings.disabled) {
            return false;
        }

        const found = this.isSelected(item);
        const limit = this.selectedItems.length < this.settings.limitSelection ? true : false;

        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            } else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }
            this.showSelect = false;
            this.closeDropdown();

        } else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.data && (this.isSelectAll || this.data.length > this.selectedItems.length)) {
            this.isSelectAll = false;
        }
        if (this.data && (this.data.length == this.selectedItems.length)) {
            this.isSelectAll = true;
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to check form is valid
     * @param c: form control
     */
    public validate(c: FormControl): any {
        return null;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to trigger open drop down
     */
    private _onTriggerDropDown(openId: string): any {
        if (!this.id) {
            return null;
        }
        const id = this.id;
        const evt = document.getElementById('dropdown-' + id);
        setTimeout(() => {
            // tslint:disable-next-line:no-unused-expression
            (!!evt) && evt.click();
        }, 100);

    }

    // tslint:disable-next-line:member-ordering
    private onTouchedCallback: (_: any) => void = noop;
    // tslint:disable-next-line:member-ordering
    private onChangeCallback: (_: any) => void = noop;

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to patch the selected value to scayla select
     * @param value: selected value from api
     */
    public writeValue(value: any) {
        // tslint:disable-next-line:no-unused-expression
        this.currentValue = value;
        value = this._selectValueByIdUsingCachedElements(value);
        if (!!value && value !== undefined && value !== null) {
            if (this.settings.singleSelection) {
                try {

                    if (value.length > 1) {
                        this.selectedItems = [value[0]];
                        throw new MyException(404, { 'msg': 'Single Selection Mode, Selected Items cannot have more than one item.' });
                    } else {
                        this.selectedItems = value;
                    }
                } catch (e) {
                    console.error(e.body.msg);
                }

            } else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.splice(0, this.settings.limitSelection);
                } else {
                    this.selectedItems = value;
                }
                if (this.selectedItems.length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
            }
        } else {
            this.selectedItems = [];
        }

    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to filter cached value using id
     * @param val: values to patch
     */
    private _selectValueByIdUsingCachedElements(val: any): Object {
        let updatedData: any;
        if (this.settings.selectType === 'customtag' && !!this.cachedItems) {
            const data = this.cachedItems;
            updatedData = data.filter(e => val.includes(e.itemName));
            const updatedDataName: any = updatedData.map(e => e.itemName);
            this.selectedItemsNotListed = val.filter(e => !updatedDataName.includes(e));
        } else if (!!this.settings.singleSelection) {
            const data = this.cachedItems;
            if (data) { updatedData = data.filter(e => e.id == val); }
        } else if (!!val && val.length > 0 && !!this.cachedItems) {
            const data = this.cachedItems;
            updatedData = data.filter(e => val.includes((e.id)));
        }
        return updatedData;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * From ControlValueAccessor interface
     */
    public registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to append value to for controller
     */
    private _formControllerdataAppend(): void {
        if (this.settings.selectType === 'customtag') {
            const selectedData = this.selectedItems.map(e => e.itemName);
            const data = selectedData.concat(this.selectedItemsNotListed);
            this.onChangeCallback(data);
            this.onTouchedCallback(data);
        } else if (!!this.settings.singleSelection) {
            const data = this.selectedItems.map(e => e.id)[0];
            this.onChangeCallback(data);
            this.onTouchedCallback(data);
        } else {
            const data = this.selectedItems.map(e => e.id);
            this.onChangeCallback(data);
            this.onTouchedCallback(data);
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     * 
     * Function to store token to local Storage
     * @param token--token
     */
    // From ControlValueAccessor interface
    public registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     * 
     * Function to store token to local Storage
     * @param token--token
     */
    public trackByFn(index: number, item: any) {
        return item[this.settings.primaryKey];
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to check value is selected or not - used to create list in dropdown
     * @param clickedItem: clicked item
     */
    public isSelected(clickedItem: any) {
        let found = false;
        // tslint:disable-next-line:no-unused-expression
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                found = true;
            }
        });
        return found;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     * 
     * Function to add item to the selected array
     * @param item: item o add
     */
    public addSelected(item: any) {
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
            this.closeDropdown();
            // tslint:disable-next-line:curly
        } else
            this.selectedItems.push(item);
        this._formControllerdataAppend();
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     * 
     * Function to remove item from list
     * @param clickedItem: item clicked
     */
    public removeSelected(clickedItem: any) {
        // tslint:disable-next-line:no-unused-expression
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
            }
        });
        this._formControllerdataAppend();
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     * 
     * Function to remove all item from list
     */
    public onClearAll(e) {
        this.selectedItems = [];
        this.selectedItemsNotListed = [];
        this._formControllerdataAppend();
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to toggle dropdown
     * @param evt: event
     */
    public toggleDropdown(evt: any) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.settings.enableSearchFilter && !this.searchTempl) {
                setTimeout(() => {
                    this.searchInput.nativeElement.focus();
                }, 0);
            }
            this.onOpen.emit(true);
        } else {
            this.onClose.emit(false);
        }
        evt.preventDefault();
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to close dropdown
     */
    public closeDropdown() {
        if (this.searchInput && this.settings.lazyLoading) {
            this.searchInput.nativeElement.value = '';
            this.totalHeight = this.itemHeight * this.data.length;
            this.totalRows = this.data.length;
            this.updateView(this.scrollTop);
        }
        if (this.searchInput) {
            this.searchInput.nativeElement.value = '';
        }
        this.filter = '';
        this.isActive = false;
        this.onClose.emit(false);
        this.data = this.listdata = [];
        this.data = this.listdata = this.cachedItems;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to toggle select all items from dropdown
     */
    public toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this._formControllerdataAppend();

            this.onSelectAll.emit(this.selectedItems);
        } else {
            this.selectedItems = [];
            this.isSelectAll = false;
            this._formControllerdataAppend();
            this.onDeSelectAll.emit(this.selectedItems);
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     * 
     * Function to toggle showing scayla select for clone view
     */
    public toggleShowSelect(): void {
        this.showSelect = true;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to handle groupby data
     * @param arr: data
     * @param field: groupby config
     */
    public transformData(arr: Array<any>, field: any): Array<any> {
        const groupedObj: any = arr.reduce((prev: any, cur: any) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        const tempArr: any = [];
        Object.keys(groupedObj).map(function (x) {
            tempArr.push({ key: x, value: groupedObj[x] });
        });
        return tempArr;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to render scayla select data
     * @param fromPos: starting position
     * @param howMany: count of item
     */
    public renderChunk(fromPos: any, howMany: any) {
        this.chunkArray = [];
        this.chunkIndex = [];
        let finalItem = fromPos + howMany;
        // tslint:disable-next-line:curly
        if (finalItem > this.totalRows)
            finalItem = this.totalRows;

        for (let i = fromPos; i < finalItem; i++) {
            this.chunkIndex.push((i * this.itemHeight) + 'px');
            // tslint:disable-next-line:no-unused-expression
            (!!this.data) && this.chunkArray.push(this.data[i]);
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to trigger when scrollin item
     * @param e: event
     */
    public onScroll(e: any) {
        this.scrollTop = e.target.scrollTop;
        this.updateView(this.scrollTop);

    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to update scayla select view
     */
    public updateView(scrollTop: any) {
        const scrollPos = scrollTop ? scrollTop : 0;
        let first = (scrollPos / this.itemHeight) - this.screenItemsLen;
        const firstTemp = '' + first;
        first = parseInt(firstTemp) < 0 ? 0 : parseInt(firstTemp);
        this.renderChunk(first, this.cachedItemsLen);
        this.lastRepaintY = scrollPos;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to trigger when a key is clicked. Used to select item using keydow oftab and ender
     * @param evt: event
     */
    public keyDownEvent(evt: any) {
        const data: any = this.selectedItems.map(e => e.id);
        const filteredElems: Array<any> = [];
        if (evt.target.value.toString() !== '') {
            this.data.filter(function (el: any) {
                for (const prop in el) {
                    if (el[prop].toString().toLowerCase().indexOf(evt.target.value.toString().toLowerCase()) >= 0) {
                        filteredElems.push(el);
                        break;
                    }
                }
            });
        }
        if (evt.key === 'Enter' || evt.key === 'Tab') {
            evt.preventDefault();
            if (filteredElems.length === 1 && this.settings.selectType !== 'customtag' && !data.includes(filteredElems[0].id)) {
                this.addSelected(filteredElems[0]);
                this.closeDropdown();
                // tslint:disable-next-line:max-line-length
            } else if (filteredElems.length === 1 && filteredElems[0].itemName === evt.target.value && !data.includes(filteredElems[0].id)) {
                this.addSelected(filteredElems[0]);
                this.closeDropdown();
            } else if (!!evt.target.value.trim() && this.settings.selectType === 'customtag') {
                this.selectedItemsNotListed.push(evt.target.value.toString().trim());
                evt.target.value = '';
                this._formControllerdataAppend();
                this.closeDropdown();
            }
        }
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to trigger when a custom typed item is selected
     * @param item: item clicked
     */
    public onItemClickNotListed(item: any) {
        const index = this.selectedItemsNotListed.indexOf(item);
        // tslint:disable-next-line:no-unused-expression
        (index !== -1) && this.selectedItemsNotListed.splice(index, 1);
        this._formControllerdataAppend();
        this.showSelect = false;
    }

    /**
     * @author Vishnu C A <vishnu.ca@pitsolutions.com>
     *
     * Function to filter dropdown items according to search keyword
     * @param evt: event
     */
    public filterInfiniteList(evt: any) {
        const filteredElems: Array<any> = [];
        this.listdata = this.cachedItems.slice();
        if (evt.target.value.toString() !== '') {
            this.listdata.filter(function (el: any) {
                for (const prop in el) {
                    if (el[prop].toString().toLowerCase().indexOf(evt.target.value.toString().toLowerCase()) >= 0) {
                        filteredElems.push(el);
                        break;
                    }
                }
            });
            // this.cachedItems = this.data;
            this.totalHeight = this.itemHeight * filteredElems.length;
            this.totalRows = filteredElems.length;
            this.listdata = [];
            this.listdata = filteredElems;
            this.updateView(this.scrollTop);
        } else if (evt.target.value.toString() === '' && this.cachedItems.length > 0) {
            this.listdata = [];
            this.listdata = this.cachedItems;
            this.totalHeight = this.itemHeight * this.listdata.length;
            this.totalRows = this.listdata.length;
            this.updateView(this.scrollTop);
        }
    }
}

@NgModule({
    imports: [CommonModule, FormsModule],
    // tslint:disable-next-line:max-line-length
    declarations: [ScaylaSelectComponent, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition],
    exports: [ScaylaSelectComponent, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition]
})
export class ScaylaSelectModule { }
