using System.Collections.Generic;

namespace backend.DTOs;

public class CartResponse
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ICollection<CartItemResponse> Items { get; set; } = new List<CartItemResponse>();
    public decimal Subtotal { get; set; }
    public int TotalItems { get; set; }
    public decimal Total { get; set; }
}