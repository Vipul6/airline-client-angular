import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManagePassengersComponent } from "./manage-passengers.component";

describe("ManagePassengersComponent", () => {
  let component: ManagePassengersComponent;
  let fixture: ComponentFixture<ManagePassengersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePassengersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
