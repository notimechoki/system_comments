# Generated by Django 5.1.2 on 2024-10-28 23:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0002_comment_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='text_file',
            field=models.FileField(blank=True, null=True, upload_to='comment_files/'),
        ),
    ]
