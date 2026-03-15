using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private const string DefaultUserId = "default-user";
    private readonly MarketplaceContext _context;

    public CartController(MarketplaceContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var cart = await GetUserCartAsync();

        if (cart is null)
        {
            return Ok(CreateEmptyCartResponse());
        }

        return Ok(ToCartResponse(cart));
    }

    [HttpPost]
    public async Task<ActionResult<CartResponse>> AddToCart([FromBody] AddToCartRequest request)
    {
        var productExists = await _context.Products.AnyAsync(p => p.Id == request.ProductId);
        if (!productExists)
        {
            return NotFound(new { message = "Product not found." });
        }

        var cart = await GetUserCartAsync();
        if (cart is null)
        {
            cart = new Cart
            {
                UserId = DefaultUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Carts.Add(cart);
        }

        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
        if (existingItem is null)
        {
            cart.CartItems.Add(new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }
        else
        {
            var newQuantity = existingItem.Quantity + request.Quantity;
            if (newQuantity > 99)
            {
                return BadRequest(new { message = "Quantity cannot exceed 99." });
            }

            existingItem.Quantity = newQuantity;
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var updatedCart = await GetUserCartAsync();
        return Ok(updatedCart is null ? CreateEmptyCartResponse() : ToCartResponse(updatedCart));
    }

    [HttpPut("{cartItemId:int}")]
    public async Task<ActionResult<CartResponse>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        var cartItem = await _context.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart.UserId == DefaultUserId);

        if (cartItem is null)
        {
            return NotFound(new { message = "Cart item not found." });
        }

        cartItem.Quantity = request.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updatedCart = await GetUserCartAsync();
        return Ok(updatedCart is null ? CreateEmptyCartResponse() : ToCartResponse(updatedCart));
    }

    [HttpDelete("{cartItemId:int}")]
    public async Task<ActionResult<CartResponse>> RemoveCartItem(int cartItemId)
    {
        var cart = await GetUserCartAsync();
        if (cart is null)
        {
            return Ok(CreateEmptyCartResponse());
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (cartItem is null)
        {
            return NotFound(new { message = "Cart item not found." });
        }

        _context.CartItems.Remove(cartItem);
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updatedCart = await GetUserCartAsync();
        return Ok(updatedCart is null ? CreateEmptyCartResponse() : ToCartResponse(updatedCart));
    }

    [HttpDelete]
    public async Task<ActionResult<CartResponse>> ClearCart()
    {
        var cart = await GetUserCartAsync();
        if (cart is null)
        {
            return Ok(CreateEmptyCartResponse());
        }

        if (cart.CartItems.Count > 0)
        {
            _context.CartItems.RemoveRange(cart.CartItems);
            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return Ok(new CartResponse
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = new List<CartItemResponse>(),
            Subtotal = 0m,
            TotalItems = 0,
            Total = 0m
        });
    }

    private async Task<Cart?> GetUserCartAsync()
    {
        return await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == DefaultUserId);
    }

    private static CartResponse ToCartResponse(Cart cart)
    {
        var itemResponses = cart.CartItems
            .Select(ci => new CartItemResponse
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product?.Name ?? string.Empty,
                Price = ci.Product?.Price ?? 0m,
                ImageUrl = ci.Product?.ImageUrl,
                Quantity = ci.Quantity,
                LineTotal = (ci.Product?.Price ?? 0m) * ci.Quantity
            })
            .ToList();

        var subtotal = itemResponses.Sum(i => i.LineTotal);
        var totalItems = itemResponses.Sum(i => i.Quantity);

        return new CartResponse
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = itemResponses,
            Subtotal = subtotal,
            TotalItems = totalItems,
            Total = subtotal
        };
    }

    private static CartResponse CreateEmptyCartResponse()
    {
        return new CartResponse
        {
            Id = 0,
            UserId = DefaultUserId,
            Items = new List<CartItemResponse>(),
            Subtotal = 0m,
            TotalItems = 0,
            Total = 0m
        };
    }
}