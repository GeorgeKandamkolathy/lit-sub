from story.serializers import StorySerializer
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import serializers, status
from .models import Comment, Story
from user.models import User
import pytest
from django.contrib.auth import get_user_model
from rest_framework.parsers import JSONParser

@pytest.mark.django_db
class StoryTests(APITestCase): 
    USER = "Jose"
    PASS = "password"

    def create_user(self):
        get_user_model().objects.create_user(self.USER, '', self.PASS)
        response = self.client.login(username=self.USER, password=self.PASS)

        self.assertEqual(response, True)

    def test_create_story(self):
        self.create_user()

        url = reverse('story:story')
        data = {"story_text": "bug the end", "story_title": "bug"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['story_text'], "bug the end")
        self.assertEqual(response.data['author_name'], self.USER)
    
    def test_create_story_no_login(self):
        url = reverse('story:story')
        data = {"story_text": "bug the end", "story_title": "bug"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_all_story(self):
        self.test_create_story()

        url = reverse('story:story')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Story.objects.all().count(), 1)
        self.assertEqual(response.data[0]['story_title'], "bug")

    def test_get_specific_story(self):
        self.test_create_story()
        url = reverse('story:detail', args=[1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["story_title"], "bug")

    def test_create_empty_story(self):
        self.create_user()

        url = reverse('story:story')
        data = {'story_text': '', 'story_title': 'bug'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_specific_no_story(self):
        url = reverse('story:detail', args=[10])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_delete_story(self):
        self.test_create_story()
        story = Story.objects.get(id=1)
        print(story.author.id)
        url = reverse('story:detail', args=[1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Story.objects.all().exists())
        
    def test_delete_story_unauthorised(self):
        self.test_create_story()
        self.client.logout()

        url = reverse('story:detail', args=[1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Story.objects.all().exists())        
    
    def test_delete_story_not_exist(self):
        self.create_user()

        url = reverse('story:detail', args=[1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_comment(self):
        self.test_create_story()

        url = reverse('story:detail', args=[1])
        response = self.client.post(url, data={"comment_text": "i like bug"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['comment_text'], "i like bug")
        self.assertEqual(response.data['author_name'], self.USER)

    
    def test_post_comment_no_login(self):
        self.test_create_story()
        self.client.logout()

        url = reverse('story:detail', args=[1])
        response = self.client.post(url, data={"comment_text": "i like bug"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_get_comment(self):
        self.test_post_comment()

        url = reverse('story:comment', args=[1, 0])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['comment_text'], "i like bug")

    def test_get_comment_no_login(self):
        self.test_post_comment()
        self.client.logout()

        url = reverse('story:comment', args=[1, 1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_delete_comment(self):
        self.test_post_comment()

        url = reverse('story:comment', args=[1, 1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Comment.objects.all().exists())

    def test_delete_comment_not_authorised(self):
        self.test_post_comment()
        self.client.logout()

        url = reverse('story:comment', args=[1, 1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comment.objects.all().exists())
    
    def test_delete_comment_not_exist(self):
        self.create_user()

        url = reverse('story:comment', args=[1, 1])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(Comment.objects.all().exists())

    def test_like_post(self):
        self.test_create_story()

        url = reverse('story:like', args=["story",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes'], 1)

    def test_like_post_no_login(self):
        self.test_create_story()
        self.client.logout()

        url = reverse('story:like', args=["story",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        

    def test_unlike_post(self):
        self.test_like_post()

        url = reverse('story:like', args=["story",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes'], 0)

    def test_unlike_post_no_login(self):
        self.test_like_post()
        self.client.logout()

        url = reverse('story:like', args=["story",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_like_comment(self):
        self.test_post_comment()

        url = reverse('story:like', args=["comment",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes'], 1)

    def test_like_comment_no_login(self):
        self.test_post_comment()
        self.client.logout()

        url = reverse('story:like', args=["comment",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        

    def test_unlike_comment(self):
        self.test_like_comment()

        url = reverse('story:like', args=["comment",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes'], 0)

    def test_unlike_comment_no_login(self):
        self.test_like_comment()
        self.client.logout()

        url = reverse('story:like', args=["comment",1])
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
