using System.Security.Cryptography;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace MaiChartManager;

public static class OfflineReg
{
    private static readonly byte[] key = Convert.FromBase64String("MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAELqwuvWZyW11DBMPrKu9ZNrEsty0QZKfGn2/cplV3jkg0gc7fc9Z0XFYcQuHJ3sIm7NudTKg97BmLazJGQLiNrQ==");

    public static async Task<TokenValidationResult> VerifyAsync(string token)
    {
        var handler = new JsonWebTokenHandler();
        using var ecdsa = ECDsa.Create();
        ecdsa.ImportSubjectPublicKeyInfo(key, out _);
        var ecdsaSecurityKey = new ECDsaSecurityKey(ecdsa);
        var validationParameters = new TokenValidationParameters
        {
            ValidIssuer = "MaiChartManager",
            ValidateAudience = false,
            IssuerSigningKey = ecdsaSecurityKey
        };
        return await handler.ValidateTokenAsync(token, validationParameters);
    }
}