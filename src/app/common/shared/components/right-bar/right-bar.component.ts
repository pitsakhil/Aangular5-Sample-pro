import { Component, OnInit, Input, OnChanges, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent implements OnInit, OnChanges {
  @Input() documentId: number;
  @Input() moduleId: number;
  @Input() updateDocumentId: number;
  @Input() isFlag: boolean;
  public saveMetadata: EventEmitter<null> = new EventEmitter();
  private _subscriptions = new Subscription();
  constructor(
    private metadataService: MetadataService ) { }

  ngOnInit() {
    this._addSubscriptions();
  }

  ngOnChanges(changes) {
    this._onInputChange(changes);
  }

  private _onInputChange(changes): void {

    if (changes && changes['documentId']) {
      this.documentId = changes['documentId']['currentValue'];
    }

  }

  private _addSubscriptions() {
    this._subscriptions.add(this.metadataService.getUserPermissionDetails().subscribe((res) => {
    }));
  }

}
