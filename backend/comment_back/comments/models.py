from django.db import models
from django.core.exceptions import ValidationError

def validate_file_size(value):
    max_size_kb = 100
    if value.size > max_size_kb * 1024:
        raise ValidationError(f"Размер файла не должен превышать {max_size_kb} КБ")

class Comment(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='comment_images/', null=True, blank=True)
    text_file = models.FileField(upload_to='comment_files/', validators=[validate_file_size], null=True, blank=True)
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies'
    )

    def __str__(self):
        return f'{self.username}: {self.text[:20]}...'