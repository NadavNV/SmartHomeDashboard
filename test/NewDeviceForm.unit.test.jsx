import { expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
vi.mock("src/components/TextInput", () =>
  import("__mocks__/src/components/TextInput")
);
vi.mock("src/components/NumberInput", () =>
  import("__mocks__/src/components/NumberInput")
);
vi.mock("src/components/TimeInput", () =>
  import("__mocks__/src/components/TimeInput")
);
vi.mock("src/components/Select", () =>
  import("__mocks__/src/components/Select")
);
vi.mock("src/constants", () => import("__mocks__/src/constants"));

import NewDeviceForm from "src/components/NewDeviceForm";

global.alert = vi.fn();

const mockAddDevice = vi.fn();
const mockVerifyId = vi.fn();

describe("Test NewDeviceForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders the blank UI initially", () => {
    render(
      <NewDeviceForm
        addDevice={mockAddDevice}
        verifyId={mockVerifyId}
        disabled={false}
      />
    );
    expect(screen.getAllByText(/mock text/i)).toHaveLength(3);
    expect(screen.getByText(/mock select/i)).toBeInTheDocument();
    // No device-specific inputs rendered initially
    expect(screen.queryByText(/temperature/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/brightness/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
