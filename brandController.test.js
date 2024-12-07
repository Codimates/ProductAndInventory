const {
    createBrand,
    getBrands,
    deleteBrand,
    updateBrand
} = require("./controllers/brandController");
const Brand = require("./models/brand");

jest.mock("./models/brand");

describe("Brand Controller", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                brandname: "Nike",
                brandlogo: "nike-logo.png"
            },
            params: {
                brandId: "brand123"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("createBrand", () => {
        it("should create a brand successfully", async () => {
            const mockBrand = {
                _id: "brand123",
                brandname: "Nike",
                brandlogo: "nike-logo.png"
            };

            Brand.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockBrand)
            }));

            await createBrand(req, res);

            expect(Brand).toHaveBeenCalledWith({
                brandname: "Nike",
                brandlogo: "nike-logo.png"
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Brand created successfully",
                brand: mockBrand
            });
        });

        it("should handle server errors", async () => {
            const mockError = new Error("Database error");

            Brand.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(mockError)
            }));

            await createBrand(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error creating brand",
                error: mockError.message
            });
        });
    });

    describe("getBrands", () => {
        it("should retrieve all brands", async () => {
            const mockBrands = [
                { _id: "brand123", brandname: "Nike", brandlogo: "nike-logo.png" },
                { _id: "brand456", brandname: "Adidas", brandlogo: "adidas-logo.png" }
            ];

            Brand.find.mockResolvedValue(mockBrands);

            await getBrands(req, res);

            expect(Brand.find).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBrands);
        });

        it("should handle server errors", async () => {
            const mockError = new Error("Database error");

            Brand.find.mockRejectedValue(mockError);

            await getBrands(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error getting brands",
                error: mockError.message
            });
        });
    });

    describe("deleteBrand", () => {
        it("should delete a brand successfully", async () => {
            const mockBrand = { _id: "brand123", brandname: "Nike" };

            Brand.findById.mockResolvedValue(mockBrand);
            Brand.findByIdAndDelete.mockResolvedValue(mockBrand);

            await deleteBrand(req, res);

            expect(Brand.findById).toHaveBeenCalledWith("brand123");
            expect(Brand.findByIdAndDelete).toHaveBeenCalledWith("brand123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Brand deleted successfully" });
        });

        it("should return 400 if brand is not found", async () => {
            Brand.findById.mockResolvedValue(null);

            await deleteBrand(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Brand not found" });
        });

        it("should handle server errors", async () => {
            const mockError = new Error("Database error");

            Brand.findById.mockRejectedValue(mockError);

            await deleteBrand(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to delete brand. Please try again later."
            });
        });
    });

    describe("updateBrand", () => {
        it("should update a brand successfully", async () => {
            const mockBrand = { _id: "brand123", brandname: "Nike", brandlogo: "nike-logo.png" };
            const mockUpdatedBrand = { ...mockBrand, brandname: "Adidas" };

            Brand.findById.mockResolvedValue(mockBrand);
            Brand.findByIdAndUpdate.mockResolvedValue(mockUpdatedBrand);

            req.body.brandname = "Adidas";

            await updateBrand(req, res);

            expect(Brand.findById).toHaveBeenCalledWith("brand123");
            expect(Brand.findByIdAndUpdate).toHaveBeenCalledWith(
                "brand123",
                { brandname: "Adidas", brandlogo: "nike-logo.png" },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Brand updated successfully",
                brand: mockUpdatedBrand
            });
        });

        it("should return 400 if brand is not found", async () => {
            Brand.findById.mockResolvedValue(null);

            await updateBrand(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Brand not found" });
        });

        it("should handle server errors", async () => {
            const mockError = new Error("Database error");

            Brand.findById.mockRejectedValue(mockError);

            await updateBrand(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to update brand. Please try again later."
            });
        });
    });
});
