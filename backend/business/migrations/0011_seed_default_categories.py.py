from django.db import migrations

def create_default_categories(apps, schema_editor):
    Category = apps.get_model("business", "Category")
    defaults = ["General", "Food", "Electronics", "Services"]
    for name in defaults:
        Category.objects.get_or_create(name=name)

class Migration(migrations.Migration):

    dependencies = [
        ("business", "0010_business_user"),  # <- match your last existing migration
    ]

    operations = [
        migrations.RunPython(create_default_categories),
    ]