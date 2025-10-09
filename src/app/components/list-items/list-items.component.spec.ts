import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItemsComponent } from './list-items.component';
import { ListConfig, ListColumn } from './list-items.component';

describe('ListItemsComponent', () => {
  let component: ListItemsComponent;
  let fixture: ComponentFixture<ListItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemsComponent);
    component = fixture.componentInstance;
    
    // Set up default config
    component.config = {
      title: 'Test List',
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' }
      ],
      showCreateButton: true,
      createButtonLabel: '+ Add New'
    };
    
    component.data = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const titleElement = fixture.nativeElement.querySelector('.list-title');
    expect(titleElement.textContent).toContain('Test List');
  });

  it('should display create button when configured', () => {
    const createButton = fixture.nativeElement.querySelector('button[matButton="filled"]');
    expect(createButton).toBeTruthy();
    expect(createButton.textContent).toContain('+ Add New');
  });

  it('should display table headers', () => {
    const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toContain('Name');
    expect(headers[1].textContent).toContain('Email');
  });

  it('should display data rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(2);
  });

  it('should emit createClick when create button is clicked', () => {
    spyOn(component.createClick, 'emit');
    const createButton = fixture.nativeElement.querySelector('button[matButton="filled"]');
    createButton.click();
    expect(component.createClick.emit).toHaveBeenCalled();
  });

  it('should display empty message when no data', () => {
    component.data = [];
    fixture.detectChanges();
    const emptyContainer = fixture.nativeElement.querySelector('.empty-container');
    expect(emptyContainer.textContent).toContain('No hay datos disponibles');
  });
});

