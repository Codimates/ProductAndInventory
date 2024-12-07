const {
  createInventory,
  searchorder,
  getInventory,
  updateInventory,
 deleteInventory,
reduceStockLevel,
} = require("./controllers/inventoryController");
const Inventory = require("./models/inventory");

jest.mock("./models/inventory");

describe("Inventory Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      files: [],
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createInventory", () => {
    it("should create inventory successfully", async () => {
      req.body = {
        brand_name: "Apple",
        model_name: "MacBook Pro",
        stock_level: "50",
        price: "2000",
        ram: "16GB",
        processor: "M1 Pro",
        graphics_card: "Integrated",
        special_offer: "true",
      };
      req.files = [{ key: "image1.jpg" }, { key: "image2.jpg" }];
      const mockInventory = { ...req.body, _id: "12345" };

      Inventory.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockInventory),
      }));

      await createInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory created successfully",
        inventory: mockInventory,
      });
    });

    it("should return error if required fields are missing", async () => {
        req.body = {
          brand_name: "Apple",
        };
      
        await createInventory(req, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "At least one image file is required",
        });
      });
      
  });

  describe("searchorder", () => {
    it("should return matching inventory", async () => {
      req.body = { brand_name: "Apple" };
      const mockInventory = [
        { brand_name: "Apple", model_name: "MacBook Pro", _id: "12345" },
      ];

      Inventory.find.mockResolvedValue(mockInventory);

      await searchorder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Matching inventory found",
        inventory: mockInventory,
      });
    });

    it("should return 404 if no matching inventory is found", async () => {
      req.body = { brand_name: "NonExistentBrand" };
      Inventory.find.mockResolvedValue([]);

      await searchorder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No matching inventory found",
      });
    });
  });

  describe("getInventory", () => {
    it("should return all inventory", async () => {
      const mockInventory = [{ brand_name: "Apple", _id: "12345" }];

      Inventory.find.mockResolvedValue(mockInventory);

      await getInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInventory);
    });

    it("should handle errors", async () => {
      const mockError = new Error("Database error");
      Inventory.find.mockRejectedValue(mockError);

      await getInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting inventory",
        error: mockError.message,
      });
    });
  });

  describe("updateInventory", () => {
    it("should update inventory successfully", async () => {
      req.params.inventory_id = "12345";
      req.body = { brand_name: "Updated Brand" };
      const mockInventory = { _id: "12345", brand_name: "Updated Brand" };

      Inventory.findById.mockResolvedValue(mockInventory);
      Inventory.findByIdAndUpdate.mockResolvedValue(mockInventory);

      await updateInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory updated successfully",
        inventory: mockInventory,
      });
    });

    it("should return 404 if inventory not found", async () => {
      req.params.inventory_id = "12345";
      Inventory.findById.mockResolvedValue(null);

      await updateInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Inventory not found" });
    });
  });

  describe("deleteInventory", () => {
    it("should delete inventory successfully", async () => {
      req.params.inventory_id = "12345";
      const mockInventory = { _id: "12345" };

      Inventory.findById.mockResolvedValue(mockInventory);
      Inventory.findByIdAndDelete.mockResolvedValue(mockInventory);

      await deleteInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Inventory deleted successfully",
      });
    });

    it("should return 404 if inventory not found", async () => {
      req.params.inventory_id = "12345";
      Inventory.findById.mockResolvedValue(null);

      await deleteInventory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Inventory not found" });
    });
  });

  describe("reduceStockLevel", () => {
    it("should reduce stock level successfully", async () => {
      req.params.inventory_id = "12345";
      req.body.quantity = 5;
      const mockInventory = { _id: "12345", stock_level: 10 };

      Inventory.findById.mockResolvedValue(mockInventory);
      Inventory.findByIdAndUpdate.mockResolvedValue({
        ...mockInventory,
        stock_level: 5,
      });

      await reduceStockLevel(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stock level reduced successfully",
        inventory: { ...mockInventory, stock_level: 5 },
      });
    });

    it("should return 400 if stock is insufficient", async () => {
      req.params.inventory_id = "12345";
      req.body.quantity = 15;
      const mockInventory = { _id: "12345", stock_level: 10 };

      Inventory.findById.mockResolvedValue(mockInventory);

      await reduceStockLevel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient stock",
        currentStock: 10,
      });
    });
  });
});
