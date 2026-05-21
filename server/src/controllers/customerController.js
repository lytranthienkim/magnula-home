import { dbService } from '../services/dbService.js';

// Lấy tất cả khách hàng
const getAllCustomers = async (req, res) => {
  try {
    const customers = await dbService.getAllCustomers();
    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error('Get All Customers Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customers',
    });
  }
};

// Lấy khách hàng theo ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await dbService.getCustomerById(parseInt(id));

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Get Customer By ID Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
    });
  }
};

// Lấy khách hàng theo email
const getCustomerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const customer = await dbService.getCustomerByEmail(email);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Get Customer By Email Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
    });
  }
};

// Cập nhật thông tin khách hàng
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstname,
      lastname,
      email,
      phone,
      country,
      address,
      apartment,
      city,
      postalCode,
    } = req.body;

    const customer = await dbService.updateCustomer(parseInt(id), {
      firstname,
      lastname,
      email,
      phone,
      country,
      address,
      apartment,
      city,
      postalCode,
    });

    return res.status(200).json({
      success: true,
      message: 'Customer updated successfully!',
      data: customer,
    });
  } catch (error) {
    console.error('Update Customer Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update customer',
    });
  }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await dbService.deleteCustomer(parseInt(id));

    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Customer Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete customer',
    });
  }
};

// Tìm kiếm khách hàng theo tên
const searchCustomerByName = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const customers = await dbService.searchCustomer(query);

    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error('Search Customer Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search customers',
    });
  }
};

export {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  updateCustomer,
  deleteCustomer,
  searchCustomerByName,
};
